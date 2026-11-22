import { ThreatSignal, UrlAnalysisResult } from './types';

// High-profile target brands frequently spoofed in phishing attacks
const MONITORED_BRANDS = [
  'google', 'microsoft', 'apple', 'paypal', 'amazon', 'netflix',
  'chase', 'bankofamerica', 'wellsfargo', 'spotify', 'facebook',
  'instagram', 'steam', 'coinbase', 'binance', 'whatsapp', 'telegram',
  'dropbox', 'adobe', 'walmart', 'ebay', 'twitter', 'linkedin'
];

// Cyrillic and Greek confusables frequently used in homograph attacks
const CONFUSABLE_MAP: Record<string, string> = {
  '\u0430': 'a', '\u0435': 'e', '\u043E': 'o', '\u0440': 'p',
  '\u0441': 'c', '\u0443': 'y', '\u0445': 'x', '\u0455': 's',
  '\u0456': 'i', '\u0458': 'j', '\u0406': 'I', '\u0410': 'A',
  '\u0412': 'B', '\u0415': 'E', '\u041A': 'K', '\u041C': 'M',
  '\u041D': 'H', '\u041E': 'O', '\u0420': 'P', '\u0421': 'C',
  '\u0422': 'T', '\u0425': 'X', '\u03B1': 'a', '\u03BF': 'o',
  '\u03C1': 'p', '\u03BD': 'v'
};

// High-abuse or free TLDs historically associated with bulk phishing
const SUSPICIOUS_TLDS = new Set([
  'tk', 'ml', 'ga', 'cf', 'gq', 'top', 'xyz', 'work', 'click',
  'loan', 'buzz', 'country', 'rest', 'fit', 'gdn', 'kim', 'stream'
]);

/**
 * Calculates Shannon entropy of a string to detect randomized DGA domains.
 */
export function calculateEntropy(str: string): number {
  if (!str) return 0;
  const frequencies: Record<string, number> = {};
  for (const char of str) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

/**
 * Computes Levenshtein distance between two strings in linear memory.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const nextRow = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      nextRow[j] = Math.min(
        nextRow[j - 1] + 1,
        row[j] + 1,
        row[j - 1] + cost
      );
    }
    row = nextRow;
  }
  return row[b.length];
}

/**
 * Normalizes common visual substitutions (leetspeak).
 */
export function normalizeVisualSubstitutions(domain: string): string {
  return domain
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/8/g, 'b')
    .replace(/vv/g, 'w')
    .replace(/rn/g, 'm');
}

/**
 * Pure zero-execution URL security analyzer.
 * Untrusted URLs are parsed strictly as strings and never fetched.
 */
export function analyzeUrl(rawInput: string): UrlAnalysisResult {
  const trimmed = (rawInput || '').trim();
  const signals: ThreatSignal[] = [];
  let score = 0;

  if (!trimmed) {
    return {
      url: '',
      domain: '',
      isHomograph: false,
      hasSuspiciousTld: false,
      isIpHost: false,
      hasUserInfo: false,
      isTyposquat: false,
      subdomainCount: 0,
      entropy: 0,
      score: 0,
      severity: 'safe',
      signals: [],
    };
  }

  // Prepend protocol if missing for safe URL object parsing
  let normalizedUrl = trimmed;
  let hadMissingProtocol = false;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    hadMissingProtocol = true;
    normalizedUrl = 'https://' + normalizedUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    // Malformed URL structure
    signals.push({
      id: 'malformed_url',
      category: 'structure',
      title: 'Malformed URL Syntax',
      description: 'The provided string cannot be parsed as a standard URI.',
      severity: 'caution',
      evidence: trimmed,
    });
    return {
      url: trimmed,
      domain: trimmed,
      isHomograph: false,
      hasSuspiciousTld: false,
      isIpHost: false,
      hasUserInfo: false,
      isTyposquat: false,
      subdomainCount: 0,
      entropy: 0,
      score: 55,
      severity: 'caution',
      signals,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname;
  const search = parsed.search;

  // 1. Insecure Protocol Check (HTTP vs HTTPS)
  if (!hadMissingProtocol && parsed.protocol === 'http:') {
    score += 15;
    signals.push({
      id: 'insecure_http',
      category: 'protocol',
      title: 'Insecure HTTP Protocol',
      description: 'Traffic transmitted over plain HTTP is vulnerable to eavesdropping and manipulation.',
      severity: 'caution',
      evidence: parsed.protocol,
    });
  }

  // 2. UserInfo Trap Check (e.g., https://paypal.com@attacker.com)
  const hasUserInfo = Boolean(parsed.username || parsed.password);
  if (hasUserInfo) {
    score += 45;
    signals.push({
      id: 'userinfo_lure',
      category: 'structure',
      title: 'Deceptive UserInfo Authentication Lure',
      description: 'URL contains an "@" symbol designed to trick users into mistaking the prefix for the destination domain.',
      severity: 'high-risk',
      evidence: `${parsed.username}@${hostname}`,
    });
  }

  // 3. Raw IP Host Check
  const isIpv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpv6 = hostname.startsWith('[') && hostname.endsWith(']');
  const isIpHost = isIpv4 || isIpv6;
  if (isIpHost) {
    score += 40;
    signals.push({
      id: 'raw_ip_host',
      category: 'structure',
      title: 'Direct Numeric IP Host',
      description: 'Legitimate consumer websites use domain names. Numeric IP hosts often bypass DNS reputation filters.',
      severity: 'high-risk',
      evidence: hostname,
    });
  }

  // 4. Unicode Homograph & Punycode Inspection
  let isHomograph = false;
  let punycode = parsed.hostname.includes('xn--') ? parsed.hostname : undefined;
  let detectedHomographChars: string[] = [];

  for (const char of trimmed) {
    if (CONFUSABLE_MAP[char]) {
      isHomograph = true;
      detectedHomographChars.push(`${char} (looks like "${CONFUSABLE_MAP[char]}")`);
    }
  }

  if (punycode || isHomograph) {
    score += 50;
    signals.push({
      id: 'homograph_spoof',
      category: 'homograph',
      title: 'Unicode Homograph / Punycode Deception',
      description: 'The domain incorporates lookalike Unicode or Punycode (IDN) characters to mimic a genuine domain.',
      severity: 'high-risk',
      evidence: detectedHomographChars.length > 0 ? detectedHomographChars.slice(0, 3).join(', ') : punycode,
    });
  }

  // 5. Typosquatting / Brand Confusable Detection
  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? domainParts[domainParts.length - 1] : '';
  const secondLevelDomain = domainParts.length >= 2 ? domainParts[domainParts.length - 2] : hostname;

  let isTyposquat = false;
  let targetBrand: string | undefined = undefined;

  // Split SLD by hyphens and digits to detect tricks like "paypa1-security" or "login-apple"
  const domainTokens = [secondLevelDomain, ...secondLevelDomain.split(/[-_.]/)].filter(t => t.length >= 3);

  for (const token of domainTokens) {
    const normalizedToken = normalizeVisualSubstitutions(token);

    for (const brand of MONITORED_BRANDS) {
      if (token === brand) {
        continue;
      }

      const dist = levenshteinDistance(token, brand);
      const normalizedDist = levenshteinDistance(normalizedToken, brand);

      if ((dist <= 2 && brand.length >= 5) || (normalizedDist <= 1 && brand.length >= 4) || (normalizedToken.includes(brand) && token !== brand)) {
        isTyposquat = true;
        targetBrand = brand;
        score += 45;
        signals.push({
          id: 'typosquat_brand',
          category: 'typosquat',
          title: `Suspected Brand Typosquatting (${brand.toUpperCase()})`,
          description: `The domain token "${token}" closely mimics "${brand}", a known brand often targeted by phishing kits.`,
          severity: 'high-risk',
          evidence: `${token} ≈ ${brand}`,
        });
        break;
      }
    }
    if (isTyposquat) break;
  }

  // 6. Suspicious / Free TLD Check
  const hasSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
  if (hasSuspiciousTld) {
    score += 25;
    signals.push({
      id: 'suspicious_tld',
      category: 'tld',
      title: `High-Abuse Top-Level Domain (.${tld})`,
      description: `The ".${tld}" extension has a disproportionate record of malicious phishing campaigns.`,
      severity: 'caution',
      evidence: `.${tld}`,
    });
  }

  // 7. Excessive Subdomains (Domain Hiding)
  const subdomainCount = Math.max(0, domainParts.length - 2);
  if (subdomainCount >= 3) {
    score += 20;
    signals.push({
      id: 'excessive_subdomains',
      category: 'structure',
      title: 'Excessive Subdomain Stacking',
      description: 'Attackers frequently nest multiple subdomains (e.g., login.security.paypal.com.evil.com) to hide the real destination.',
      severity: 'caution',
      evidence: `${subdomainCount} subdomains in ${hostname}`,
    });
  }

  // 8. Open-Redirect Query Parameter Inspection
  const redirectParams = ['redirect', 'url', 'next', 'dest', 'return', 'target', 'out', 'view'];
  for (const param of redirectParams) {
    if (parsed.searchParams.has(param)) {
      const targetVal = parsed.searchParams.get(param) || '';
      if (targetVal.startsWith('http') || targetVal.includes('//')) {
        score += 25;
        signals.push({
          id: 'open_redirect_param',
          category: 'structure',
          title: 'Suspicious Open-Redirect Parameter',
          description: `Contains a "${param}" parameter pointing to an external destination, frequently exploited to mask phishing landings.`,
          severity: 'caution',
          evidence: `${param}=${targetVal}`,
        });
        break;
      }
    }
  }

  // 9. Shannon Entropy on Domain
  const entropy = calculateEntropy(secondLevelDomain);
  if (entropy > 3.8 && secondLevelDomain.length >= 8) {
    score += 15;
    signals.push({
      id: 'high_entropy_domain',
      category: 'structure',
      title: 'High Domain Randomness (DGA Indicator)',
      description: 'The domain name exhibits unusually high character randomness, common in disposable malware infrastructure.',
      severity: 'caution',
      evidence: `Entropy ${entropy} on "${secondLevelDomain}"`,
    });
  }

  // Cap score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine Severity
  let severity: 'safe' | 'caution' | 'high-risk' = 'safe';
  if (finalScore >= 60 || isHomograph || isIpHost || hasUserInfo || isTyposquat) {
    severity = 'high-risk';
  } else if (finalScore >= 25 || hasSuspiciousTld || subdomainCount >= 3) {
    severity = 'caution';
  }

  return {
    url: trimmed,
    domain: hostname,
    isHomograph,
    punycode,
    hasSuspiciousTld,
    isIpHost,
    hasUserInfo,
    isTyposquat,
    targetBrand,
    subdomainCount,
    entropy,
    score: finalScore,
    severity,
    signals,
  };
}
