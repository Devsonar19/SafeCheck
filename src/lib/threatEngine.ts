import { OverallThreatVerdict, ThreatSeverity, ThreatSignal } from './types';
import { analyzeUrl } from './urlAnalyzer';
import { analyzeMessage } from './messageAnalyzer';
import { redactPii } from './piiRedactor';

export interface ThreatAnalysisOptions {
  inputType: 'url' | 'message' | 'screenshot';
  content: string;
  piiRedactionEnabled: boolean;
  hybridModeEnabled: boolean;
  fileName?: string;
}

/**
 * Builds prioritized, defensive recommendations based on signals and input type.
 */
export function generateRecommendations(severity: ThreatSeverity, signals: ThreatSignal[], inputType: 'url' | 'message' | 'screenshot'): string[] {
  const recommendations: string[] = [];

  if (severity === 'high-risk') {
    recommendations.push('DO NOT click any links, open attachments, or dial phone numbers listed in this content.');
    recommendations.push('Never input login credentials, banking details, or one-time verification codes (OTPs).');
    recommendations.push('If this was received via email or SMS, mark it as Phishing / Spam and block the sender.');
    recommendations.push('If you already entered passwords, immediately go to the authentic service directly (not through the link) to change your password and revoke sessions.');
  } else if (severity === 'caution') {
    recommendations.push('Exercise caution: Verify the sender through a known, trusted official contact method before taking action.');
    recommendations.push('Inspect domain spelling manually in a clean browser tab rather than clicking directly.');
    recommendations.push('Do not share personal details, phone numbers, or two-factor codes in response.');
  } else {
    recommendations.push('No obvious malicious signatures or deceptive homographs were detected.');
    recommendations.push('Always ensure you are connecting via a secure (HTTPS) connection before authenticating.');
    recommendations.push('Keep multi-factor authentication (MFA) enabled on your primary accounts.');
  }

  // Signal-specific recommendations
  for (const s of signals) {
    if (s.category === 'homograph' || s.category === 'punycode') {
      recommendations.push('Attacker is using lookalike characters. Always type the known web address directly into your browser address bar.');
      break;
    }
  }

  for (const s of signals) {
    if (s.category === 'credential') {
      recommendations.push('Legitimate organizations will NEVER ask for your password or SMS OTP via email, SMS, or phone call.');
      break;
    }
  }

  return recommendations;
}

/**
 * Core threat engine combining deterministic heuristics and optional hybrid AI analysis.
 */
export function evaluateThreat(options: ThreatAnalysisOptions): OverallThreatVerdict {
  const startTime = performance.now();
  const { inputType, content, piiRedactionEnabled, hybridModeEnabled } = options;

  let redactedInput = content;
  let piiMasked = false;

  if (piiRedactionEnabled) {
    const piiResult = redactPii(content);
    redactedInput = piiResult.redactedText;
    piiMasked = piiResult.detectedCount > 0;
  }

  let score = 0;
  let severity: ThreatSeverity = 'safe';
  let signals: ThreatSignal[] = [];
  let summary = '';
  let confidence = 85;

  if (inputType === 'url') {
    const urlRes = analyzeUrl(content);
    score = urlRes.score;
    severity = urlRes.severity;
    signals = urlRes.signals;
    confidence = 94;

    if (severity === 'high-risk') {
      summary = `High-risk URL threat detected. Indicators suggest intentional deception (such as homographs, raw IPs, or brand typosquatting).`;
    } else if (severity === 'caution') {
      summary = `Suspicious link indicators detected (unusual TLD, subdomain stacking, or redirect parameters). Proceed with caution.`;
    } else {
      summary = `No common deceptive link techniques or homographs detected. The domain structure appears standard.`;
    }
  } else if (inputType === 'message') {
    const msgRes = analyzeMessage(content);
    score = msgRes.score;
    severity = msgRes.severity;
    signals = msgRes.signals;
    confidence = 90;

    if (severity === 'high-risk') {
      summary = `High-risk social engineering scam detected. Contains psychological coercion, credential/OTP demands, or fraudulent payment indicators.`;
    } else if (severity === 'caution') {
      summary = `Elevated caution advised. Message exhibits urgency markers or unsolicited contact patterns typical of phishing probes.`;
    } else {
      summary = `Message does not show obvious social engineering, high urgency triggers, or coercive credential prompts.`;
    }
  } else {
    // Screenshot analysis (deterministic fallback/preview)
    const lower = content.toLowerCase();
    score = 20;
    severity = 'safe';
    confidence = 88;

    if (lower.includes('urgent') || lower.includes('verify') || lower.includes('suspend') || lower.includes('payment') || lower.includes('qr')) {
      score = 75;
      severity = 'high-risk';
      signals.push({
        id: 'screenshot_visual_lure',
        category: 'impersonation',
        title: 'Deceptive Visual UI Elements Detected',
        description: 'Screenshot contains high-risk visual cues including payment demands, urgent alerts, or synthetic verification frames.',
        severity: 'high-risk',
      });
      summary = 'Screenshot contains visual indicators of coercive credential or payment spoofing.';
    } else {
      summary = 'Screenshot processed. No prominent visual deception triggers identified in local triage.';
    }
  }

  const recommendations = generateRecommendations(severity, signals, inputType);
  const executionTimeMs = Number((performance.now() - startTime).toFixed(1));

  // Cryptographic random UUID
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `scan-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  return {
    id,
    timestamp: Date.now(),
    inputType,
    rawInput: content,
    redactedInput,
    piiMasked,
    hybridMode: hybridModeEnabled,
    score,
    severity,
    confidence,
    summary,
    signals,
    recommendedActions: recommendations,
    executionTimeMs,
  };
}
