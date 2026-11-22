export interface SafetyChecklistItem {
  id: string;
  category: 'passwords' | 'browsing' | 'mobile' | 'accounts';
  label: string;
  description: string;
  recommended: boolean;
}

export interface EmergencyActionGuide {
  id: string;
  title: string;
  subtitle: string;
  urgency: 'critical' | 'high' | 'medium';
  steps: { step: number; action: string; details: string; caution?: string }[];
}

export const EMERGENCY_GUIDES: EmergencyActionGuide[] = [
  {
    id: 'clicked_link',
    title: 'I Clicked a Suspicious Link',
    subtitle: 'Immediate containment protocol within 60 seconds of clicking',
    urgency: 'high',
    steps: [
      {
        step: 1,
        action: 'Close the Tab Immediately & Do NOT Enter Any Information',
        details: 'If a form asks for login credentials, phone numbers, or credit card digits, close the tab immediately. Merely viewing a static web page rarely compromises modern sandboxed browsers unless credentials or permissions are granted.',
      },
      {
        step: 2,
        action: 'Do NOT Download or Open Any File Prompts',
        details: 'If your browser automatically initiated a file download (.exe, .dmg, .apk, .zip, .iso), delete the downloaded file from your Downloads folder immediately without opening or expanding it.',
        caution: 'Never execute or double-click downloaded files from unverified links.',
      },
      {
        step: 3,
        action: 'Clear Browser Cache & Active Cookies',
        details: 'In your browser settings, clear cookies and cache for that site or the last hour to prevent potential session hijack probes.',
      },
      {
        step: 4,
        action: 'Run a Local Antivirus / Malware Scan',
        details: 'Trigger a quick scan via Windows Defender or macOS XProtect to ensure no malicious scripts were staged.',
      },
    ],
  },
  {
    id: 'entered_credentials',
    title: 'I Entered My Password or Shared an OTP',
    subtitle: 'Urgent account recovery & credential revocation protocol',
    urgency: 'critical',
    steps: [
      {
        step: 1,
        action: 'Change Your Password IMMEDIATELY via Official Channels',
        details: 'Open a fresh, clean browser window. Go directly to the official website (e.g. type https://paypal.com directly, do NOT click the email/SMS link) and change your password.',
        caution: 'If you reuse this password on other accounts (email, bank, cloud), change those immediately as well.',
      },
      {
        step: 2,
        action: 'Revoke All Active Sessions & Connected Devices',
        details: 'In account settings, select "Sign out of all devices" or "Revoke active sessions" to immediately kick out any active adversary session token.',
      },
      {
        step: 3,
        action: 'Upgrade to Hardware-Backed 2FA (Authenticator App / FIDO2 Passkey)',
        details: 'If you were using SMS OTP, attackers may attempt SIM swapping or relay attacks. Switch your two-factor authentication to an authenticator app (Google Authenticator, Aegis, 1Password) or a hardware Passkey/YubiKey.',
      },
      {
        step: 4,
        action: 'Notify Your Financial Institution or IT Department',
        details: 'If banking credentials were compromised, immediately call your bank\'s official fraud hotline (number printed on the back of your physical debit/credit card) to freeze cards.',
      },
    ],
  },
  {
    id: 'qr_scam',
    title: 'I Scanned an Unknown QR Code ("Quishing")',
    subtitle: 'Defense against physical sticker swaps and payload redirectors',
    urgency: 'medium',
    steps: [
      {
        step: 1,
        action: 'Inspect the URL Before Opening in Camera Preview',
        details: 'Modern smartphone cameras display the destination URL before loading. Always read the domain name carefully before tapping.',
      },
      {
        step: 2,
        action: 'Check for Physical Tampering on Public Signs',
        details: 'On public meters, restaurant tables, or transit posters, physically feel the QR code. If it is a peel-off sticker stuck over an original sign, report it to the venue immediately.',
      },
      {
        step: 3,
        action: 'Never Authorize App Installs or Profile Downloads',
        details: 'A legitimate payment terminal will never require downloading an MDM profile, configuration certificate, or third-party APK.',
      },
    ],
  },
];

export const SAFETY_MODULES = [
  {
    id: 'phishing_basics',
    title: 'Anatomy of Phishing & Smishing',
    summary: 'How cybercriminals craft deceptive emails and SMS messages to exploit human psychology.',
    keyRules: [
      'Artificial Urgency: Phishers always introduce panic ("24 hours to react", "account suspended") so victims bypass skepticism.',
      'Authority Impersonation: Attackers pretend to be trusted authorities—police, tax agencies (IRS), post offices (USPS), or executives.',
      'Unsolicited Outreach: High-value actions (password resets, payment changes) should only originate from actions YOU initiated.',
      'Inspect the Sender Address Header: Never rely solely on the friendly display name. Look at the actual email domain after the "@".',
    ],
  },
  {
    id: 'homographs_punycode',
    title: 'Homographs & Punycode Demystified',
    summary: 'The technical trick behind lookalike domains that fool the human eye.',
    keyRules: [
      'Unicode Confusables: Certain non-Latin alphabets (Cyrillic, Greek, Hebrew) have glyphs identical to Latin letters (e.g. Cyrillic "а" U+0430 looks identical to Latin "a" U+0061).',
      'Punycode Translation: Internationalized Domain Names (IDNs) convert to strings starting with "xn--" (e.g. "ѕpotify.com" -> "xn--potify-w1a.com").',
      'The SafeCheck Defense: SafeCheck parses the raw Unicode codepoints and flags confusable characters automatically in under 5 ms.',
      'Safe Browsing Tip: When in doubt, bookmark trusted financial and email portals, and access them only through saved bookmarks.',
    ],
  },
  {
    id: 'mfa_security',
    title: 'MFA Hygiene & Push Fatigue',
    summary: 'Why multi-factor authentication is vital and how attackers try to bypass it.',
    keyRules: [
      'MFA Fatigue / Push Bombing: Attackers who have your password may send dozens of push notifications at 3 AM hoping you tap "Approve" out of frustration.',
      'Rule of Push Prompts: If you did not just attempt to log in yourself, NEVER tap "Approve". Tap "Deny" and immediately change your password.',
      'SMS vs Authenticator Apps: SMS OTPs can be intercepted via SIM-swapping or SS7 attacks. App-based TOTP or hardware Passkeys are dramatically more resilient.',
      'Zero-Sharing Principle: No authentic technician or support agent will EVER ask you to read back a 6-digit one-time passcode.',
    ],
  },
];

export const DEFENSIVE_CHECKLIST: SafetyChecklistItem[] = [
  {
    id: 'check-1',
    category: 'passwords',
    label: 'Use a Dedicated Password Manager',
    description: 'Generates and auto-fills unique 20+ character passwords for every single service. Password managers will never auto-fill onto a phishing domain.',
    recommended: true,
  },
  {
    id: 'check-2',
    category: 'passwords',
    label: 'Enable Hardware or App-Based 2FA',
    description: 'Replace SMS verification with TOTP apps (Bitwarden, Google Authenticator) or FIDO2 WebAuthn Passkeys.',
    recommended: true,
  },
  {
    id: 'check-3',
    category: 'browsing',
    label: 'Inspect Domains Before Authenticating',
    description: 'Always examine the domain immediately preceding the primary slash in the address bar before entering credentials.',
    recommended: true,
  },
  {
    id: 'check-4',
    category: 'browsing',
    label: 'Bookmark Primary Financial Portals',
    description: 'Never navigate to your bank or primary email via links found in SMS texts or promotional emails.',
    recommended: true,
  },
  {
    id: 'check-5',
    category: 'mobile',
    label: 'Disable Automatic Link Previews in SMS/Chat',
    description: 'Prevents your device from automatically making background requests or rendering IP loggers from unverified senders.',
    recommended: false,
  },
  {
    id: 'check-6',
    category: 'accounts',
    label: 'Audit Account Recovery Phone & Email Once per Quarter',
    description: 'Ensure backup phone numbers and secondary recovery emails are strictly up to date on Google, Apple, and banking accounts.',
    recommended: true,
  },
];
