import { MessageAnalysisResult, ThreatSignal } from './types';
import { analyzeUrl } from './urlAnalyzer';
import { redactPii } from './piiRedactor';

// Linear non-backtracking URL extraction regex
const EXTRACT_URL_REGEX = /\bhttps?:\/\/[^\s<>()"']+|(?:\b[a-zA-Z0-9-]+\.)+(?:com|org|net|io|xyz|top|info|me|co|app)\b[^\s<>()"']*/gi;

const URGENCY_PATTERNS = [
  /\b(?:immediate(?:ly)?|urgent(?:ly)?|action required|final notice)\b/i,
  /\b(?:within (?:24|48|12|1|2) hours?|today only|expires? soon)\b/i,
  /\b(?:suspended|locked|restricted|deactivated|terminated|closed)\b/i,
  /\b(?:unauthorized (?:activity|access|transaction)|security breach)\b/i,
  /\b(?:failure to (?:comply|respond)|legal action|warrant)\b/i
];

const CREDENTIAL_PATTERNS = [
  /\b(?:verify|confirm|validate|update)\s+(?:your\s+)?(?:account|password|identity|credentials|ssn|pin)\b/i,
  /\b(?:enter|provide|type)\s+(?:your\s+)?(?:otp|code|one-time|token|2fa)\b/i,
  /\b(?:login|sign in|access)\s+(?:to\s+)?(?:restore|unlock|reactivate)\b/i,
  /\b(?:click here to (?:login|verify|reset))\b/i
];

const FINANCIAL_PATTERNS = [
  /\b(?:wire transfer|western union|moneygram|cashapp|venmo|zelle)\b/i,
  /\b(?:gift card|apple card|google play card|steam card)\b/i,
  /\b(?:bitcoin|crypto(?:currency)?|btc|eth|usdt|wallet address)\b/i,
  /\b(?:claim (?:prize|reward|refund|settlement|inheritance))\b/i,
  /\b(?:invoice overdue|unpaid balance|pending payment|refund of \$\d+)\b/i
];

const IMPERSONATION_PATTERNS = [
  /\b(?:irs|internal revenue service|tax department)\b/i,
  /\b(?:usps|fedex|ups|dhl|customs clearance|package delivery)\b/i,
  /\b(?:geek squad|norton|mcafee|antivirus subscription)\b/i,
  /\b(?:paypal|apple support|microsoft support|bank security)\b/i
];

/**
 * Pure analyzer for SMS, Email, and Chat threat heuristics.
 */
export function analyzeMessage(text: string): MessageAnalysisResult {
  const trimmed = (text || '').trim();
  const signals: ThreatSignal[] = [];

  if (!trimmed) {
    return {
      text: '',
      urgencyScore: 0,
      credentialScore: 0,
      financialScore: 0,
      extractedUrls: [],
      urlResults: [],
      pii: { redactedText: '', detectedCount: 0, items: [] },
      score: 0,
      severity: 'safe',
      signals: [],
    };
  }

  // 1. PII Redaction Assessment
  const pii = redactPii(trimmed);
  if (pii.detectedCount > 0) {
    const summary = pii.items.map(i => `${i.count} ${i.type}`).join(', ');
    signals.push({
      id: 'pii_exposure',
      category: 'pii',
      title: 'Personally Identifiable Information Detected',
      description: `Contains sensitive personal information (${summary}) which should never be shared over unverified channels.`,
      severity: 'caution',
      evidence: summary,
    });
  }

  // 2. Urgency & Coercion Heuristics
  let urgencyHits = 0;
  for (const pattern of URGENCY_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      urgencyHits++;
    }
  }
  const urgencyScore = Math.min(100, urgencyHits * 25);
  if (urgencyScore >= 25) {
    signals.push({
      id: 'social_urgency',
      category: 'urgency',
      title: 'Psychological Urgency & Fear Tactics',
      description: 'Employs artificial time-pressure or alarmist threat language ("account suspended", "immediate action") designed to prevent careful thinking.',
      severity: urgencyScore >= 50 ? 'high-risk' : 'caution',
      evidence: `Urgency factor: ${urgencyScore}%`,
    });
  }

  // 3. Credential & Identity Harvesting
  let credentialHits = 0;
  for (const pattern of CREDENTIAL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      credentialHits++;
    }
  }
  const credentialScore = Math.min(100, credentialHits * 35);
  if (credentialScore >= 35) {
    signals.push({
      id: 'credential_harvesting',
      category: 'credential',
      title: 'Credential / OTP Harvesting Coercion',
      description: 'Directly solicits account passwords, verification OTPs, or identity confirmation via unverified prompts.',
      severity: 'high-risk',
      evidence: `Credential harvesting score: ${credentialScore}%`,
    });
  }

  // 4. Financial & Payment Coercion
  let financialHits = 0;
  for (const pattern of FINANCIAL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      financialHits++;
    }
  }
  const financialScore = Math.min(100, financialHits * 30);
  if (financialScore >= 30) {
    signals.push({
      id: 'financial_extortion',
      category: 'financial',
      title: 'Irreversible Payment or Gift Card Lure',
      description: 'Mentions high-risk payment mechanisms (wire transfers, crypto, gift cards, or unsolicited refund rewards).',
      severity: 'high-risk',
      evidence: `Financial indicator score: ${financialScore}%`,
    });
  }

  // 5. Impersonation Indicator
  let impersonationHits = 0;
  for (const pattern of IMPERSONATION_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      impersonationHits++;
      signals.push({
        id: 'brand_impersonation',
        category: 'impersonation',
        title: `High-Target Brand / Agency Mention (${match[0]})`,
        description: `Claims affiliation with "${match[0]}", one of the most frequently spoofed entities in phishing campaigns.`,
        severity: 'caution',
        evidence: match[0],
      });
      break;
    }
  }

  // 6. Extract and inspect embedded URLs
  const matchedUrls = trimmed.match(EXTRACT_URL_REGEX) || [];
  // Deduplicate URLs
  const uniqueUrls = Array.from(new Set(matchedUrls));
  const urlResults = uniqueUrls.map(u => analyzeUrl(u));

  let maxUrlScore = 0;
  for (const ur of urlResults) {
    if (ur.score > maxUrlScore) {
      maxUrlScore = ur.score;
    }
    // Propagate critical URL signals
    for (const sig of ur.signals) {
      if (sig.severity === 'high-risk' || sig.severity === 'caution') {
        signals.push({
          ...sig,
          id: `embedded_${sig.id}`,
          title: `[Embedded Link] ${sig.title}`,
        });
      }
    }
  }

  // Calculate composite score
  let totalScore = (urgencyScore * 0.35) + (credentialScore * 0.4) + (financialScore * 0.3) + (impersonationHits * 25);
  if (maxUrlScore > 0) {
    totalScore = Math.max(totalScore, maxUrlScore * 0.9 + totalScore * 0.4);
  }
  const finalScore = Math.min(100, Math.round(totalScore));

  let severity: 'safe' | 'caution' | 'high-risk' = 'safe';
  if (finalScore >= 50 || credentialHits > 0 || maxUrlScore >= 60 || urgencyHits >= 2) {
    severity = 'high-risk';
  } else if (finalScore >= 20 || urgencyHits > 0 || financialHits > 0 || pii.detectedCount > 0 || impersonationHits > 0 || maxUrlScore > 0) {
    severity = 'caution';
  }

  return {
    text: trimmed,
    urgencyScore,
    credentialScore,
    financialScore,
    extractedUrls: uniqueUrls,
    urlResults,
    pii,
    score: finalScore,
    severity,
    signals,
  };
}
