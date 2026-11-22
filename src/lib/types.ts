export type ThreatSeverity = 'safe' | 'caution' | 'high-risk';

export interface ThreatSignal {
  id: string;
  category: 'homograph' | 'punycode' | 'typosquat' | 'tld' | 'protocol' | 'urgency' | 'credential' | 'financial' | 'pii' | 'structure' | 'impersonation';
  title: string;
  description: string;
  severity: ThreatSeverity;
  evidence?: string;
}

export interface UrlAnalysisResult {
  url: string;
  domain: string;
  isHomograph: boolean;
  punycode?: string;
  hasSuspiciousTld: boolean;
  isIpHost: boolean;
  hasUserInfo: boolean;
  isTyposquat: boolean;
  targetBrand?: string;
  subdomainCount: number;
  entropy: number;
  score: number; // 0 (safest) to 100 (highest risk)
  severity: ThreatSeverity;
  signals: ThreatSignal[];
}

export interface PiiItem {
  type: 'email' | 'phone' | 'card' | 'id' | 'otp';
  count: number;
}

export interface PiiRedactionResult {
  redactedText: string;
  detectedCount: number;
  items: PiiItem[];
}

export interface MessageAnalysisResult {
  text: string;
  urgencyScore: number;
  credentialScore: number;
  financialScore: number;
  extractedUrls: string[];
  urlResults: UrlAnalysisResult[];
  pii: PiiRedactionResult;
  score: number;
  severity: ThreatSeverity;
  signals: ThreatSignal[];
}

export interface ScreenshotAnalysisResult {
  fileName: string;
  mimeType: string;
  score: number;
  severity: ThreatSeverity;
  summary: string;
  extractedText: string;
  signals: ThreatSignal[];
  recommendedActions: string[];
}

export interface OverallThreatVerdict {
  id: string;
  timestamp: number;
  inputType: 'url' | 'message' | 'screenshot';
  rawInput: string;
  redactedInput: string;
  piiMasked: boolean;
  hybridMode: boolean;
  score: number; // 0 to 100
  severity: ThreatSeverity;
  confidence: number; // 0 to 100%
  summary: string;
  signals: ThreatSignal[];
  recommendedActions: string[];
  aiInsight?: string;
  executionTimeMs: number;
}

export interface ScamDrill {
  id: string;
  level: 1 | 2 | 3 | 4;
  levelName: 'Level 1: Fundamentals' | 'Level 2: Urgent Smishing' | 'Level 3: Advanced Spoofing' | 'Level 4: Spear Phishing & Quishing';
  type: 'url' | 'message' | 'screenshot';
  title: string;
  scenario: string;
  sender?: string;
  content: string;
  isScam: boolean;
  redFlags: string[];
  safeIndicators: string[];
  explanation: string;
}

export interface SafetyTopic {
  id: string;
  title: string;
  category: 'emergency' | 'phishing' | 'homographs' | 'quishing' | 'mfa';
  description: string;
  doList: string[];
  dontList: string[];
  quickCheck: string;
  recoverySteps?: string[];
}
