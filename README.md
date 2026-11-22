# SafeCheck — Scam, Phishing & Unsafe Link Shield

> **PromptWars Hackathon Submission**  
> **Vertical**: Defence and Security  
> **Evaluation Alignment**: 100% Defensive Focus — Protect, Detect & Educate

SafeCheck is a privacy-first, zero-execution defensive security workbench that protects everyday users, students, and organizations from phishing links, social-engineering scam messages, and deceptive screenshots without ever visiting untrusted URLs or exposing sensitive personal data.

---

## 1. Chosen Vertical
**Defence and Security** (PromptWars: Defence & Security Track)

### Problem Statement Alignment
The PromptWars Defence and Security mandate asks for solutions that protect people, data, or systems by detecting, preventing, and raising awareness about threats such as scams, unsafe links, and fake content—keeping users safer without causing harm.

SafeCheck aligns directly with all three foundational defensive pillars:
1. **Detect**: Instant sub-5ms deterministic threat heuristics fused with multimodal Google Gemini (`gemini-2.5-flash`) reasoning across URLs, SMS/email copy, and screenshots.
2. **Prevent**: Zero-execution link inspection (untrusted URLs are treated strictly as inert strings, never fetched or rendered as clickable links), automated client-side PII redaction (masking emails, cards, phone numbers, and OTPs before data leaves the browser), and prototype-pollution immune server architecture.
3. **Raise Awareness**: Interactive 4-level **Scam Drills** ("Spot the Threat") covering beginner typosquatting to expert business email compromise (BEC) and QR-code quishing, paired with step-by-step **Emergency Incident Triage Playbooks** and an interactive **Personal Cyber Defense Checklist**.

---

## 2. Approach and Logic

SafeCheck utilizes a **Hybrid Local-First + Thin Hardened Proxy** architecture designed for absolute defense and privacy:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Browser Client (React 19 + Tailwind v4)              │
│                                                                        │
│   ┌──────────────────┐   ┌──────────────────────────────────────────┐  │
│   │ App Shell        │   │ Workspaces                               │  │
│   │ • Skip Link      │──▶│ • ThreatInspector (URL / SMS / Images)   │  │
│   │ • Top New Scan   │   │ • VerdictPanel (Scores, Signals, Action) │  │
│   │ • PII/AI Toggles │   │ • ScamDrills (4 Progressive Levels)      │  │
│   │ • Intuitive Rail │   │ • SafetyGuide (Triage & Checklist)       │  │
│   └──────────────────┘   │ • ScanHistory (Private Browser Ledger)   │  │
│                          └────────────────────┬─────────────────────┘  │
│                                               │                        │
│   ┌───────────────────────────────────────────▼─────────────────────┐  │
│   │ Pure-TypeScript Security Engine (src/lib/)                      │  │
│   │ • urlAnalyzer.ts      (Cyrillic homographs, Punycode, Typos)    │  │
│   │ • messageAnalyzer.ts  (Urgency, OTP harvesting, Extortion)      │  │
│   │ • piiRedactor.ts      (ReDoS-safe masking of emails/cards/OTPs) │  │
│   │ • threatEngine.ts     (Deterministic score fusion & actions)    │  │
│   │ • storage.ts          (Validated localStorage persistence)      │  │
│   └───────────────────────────────────────────┬─────────────────────┘  │
└───────────────────────────────────────────────┼────────────────────────┘
                                                │ POST /api/analyze (Redacted Data)
                                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Hardened Express Proxy (server.ts, Port 3000)            │
│  1. Security Headers (nosniff, no-referrer, X-Frame-Options, no-store) │
│  2. Map-based Sliding-Window Per-IP Rate Limiting                      │
│  3. Prototype Pollution Guards (rejects __proto__, constructor)        │
│  4. Prompt Injection Boundary (<untrusted_submission> isolation)       │
│  5. Google Gemini Reasoning (gemini-2.5-flash JSON schema)             │
└────────────────────────────────────────────────────────────────────────┘
```

### Pure Deterministic Heuristics (< 5 ms Latency)
- **Unicode Homograph Attacks**: Identifies Cyrillic (`а, с, е, о, р, ѕ, і, х`) and Greek (`α, ο, ν, ρ, τ`) confusables disguised within Latin strings (e.g. Cyrillic `ѕpotify.com`).
- **Punycode Deception**: Flags Internationalized Domain Names (IDNs) resolving via `xn--` prefixes.
- **Brand Typosquatting**: Calculates Levenshtein edit distance and visual leetspeak substitutions (e.g. `0` for `o`, `1` for `l`, `rn` for `m`) against high-value targets (PayPal, Google, Apple, Microsoft, Amazon, Netflix, Chase, etc.).
- **URL Structure Flaws**: Flags userinfo `@` credential tricks (`https://paypal.com@evil.com`), direct numeric IP hosts, excessive subdomain stacking, and open-redirect query parameters.
- **Social Engineering Cues**: Scores psychological urgency, credential/OTP harvesting patterns, and irreversible financial payment demands (crypto, wire transfers, gift cards).

---

## 3. How the Solution Works

1. **User Submits an Untrusted Target**: The user inputs a link, SMS/email text, or uploads a screenshot in the Threat Inspector workbench.
2. **Client-Side Privacy Shield (PII Redaction)**: If PII Redaction is toggled ON, emails, phone numbers, payment cards, SSNs, and 6-digit OTP codes are masked client-side before any network requests or storage operations.
3. **Sub-5ms Deterministic Scan**: The pure TypeScript engine evaluates the payload against deterministic threat heuristics, producing an immediate risk score (0-100), categorical threat signals, and actionable recommendations.
4. **Optional Hybrid AI Deep Reasoning**: In Hybrid Mode, the redacted text is submitted to `/api/analyze` where Gemini performs multimodal semantic analysis within strict prompt-injection isolation boundaries.
5. **Non-Color-Only Threat Verdict**: The user receives a clear, accessible verdict banner (`Safe`, `Caution`, or `High Risk`) combining high-contrast colors, distinct iconography, risk score meters, technical monospace evidence breakdowns, and prioritized defensive steps.
6. **Awareness & Hardening**:
   - Users train intuition via **4-level Scam Drills** with real-time feedback and red flag breakdowns.
   - Users follow **Emergency Triage Playbooks** for post-click containment or use the interactive **Personal Cyber Defense Checklist**.

---

## 4. Any Assumptions Made

1. **Passive Zero-Execution Boundary**: SafeCheck strictly operates as a passive inspection workbench. It deliberately does NOT execute outbound HTTP crawling or port scanning of user-submitted targets to prevent SSRF vulnerabilities and avoid triggering remote honeypots.
2. **Client Privacy Guarantee**: Scan history is stored entirely in browser `localStorage`. No user credentials, accounts, or analytics tracking are required.
3. **Graceful Offline Degradation**: The core security engine is 100% self-contained in pure TypeScript. If the network or Gemini API is offline, all deterministic heuristics, PII masking, drills, and guides operate seamlessly with zero loss of core functionality.

---

## 5. Evaluation Focus Areas

### [High Impact] Problem Statement Alignment
- SafeCheck directly targets the PromptWars Defence & Security problem statement by protecting everyday users from malicious links, smishing, and deceptive visuals.
- Fully defensive: zero offensive payloads, zero network exploitation tools, zero untrusted click sinks.

### [High Impact] Security — Safe & Responsible Implementation
- **Server-Only API Keys**: `GEMINI_API_KEY` is isolated to `server.ts` and never exposed to the client bundle.
- **Zero Click / Execution Sinks**: Untrusted targets are displayed only as inert monospace strings, never as clickable `<a href>` elements. React's default text escaping prevents XSS.
- **Prompt Injection Isolation**: User inputs sent to Gemini are encapsulated in `<untrusted_submission>` delimiters with strict system prompt boundaries.
- **ReDoS Immunity**: All regex patterns execute in linear time; validated by adversarial 10,000-character timing tests.
- **Prototype Pollution Defense**: Express middleware scans and rejects any JSON payloads containing `__proto__`, `constructor`, or `prototype`.
- **Hardened Security Headers**: Serves `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, `Permissions-Policy`, and `Cache-Control: no-store`.

### [Medium Impact] Code Quality — Structure, Readability, Maintainability
- 100% strict TypeScript (`tsc --noEmit` clean with zero warnings or `any` abuses).
- Clean separation of concerns: pure functional engines (`src/lib/`), reusable UI components (`src/components/`), and hardened Express server (`server.ts`).
- Full adherence to Effective TypeScript and React 19 standards.

### [Medium Impact] Efficiency — Optimal Use of Resources
- Sub-5ms deterministic rule execution with zero DOM dependencies.
- Lean repository footprint (< 2 MB source code).
- Vite production bundle size of ~330 kB with Brotli/gzip compression.
- Map-based sliding window rate limiter prevents server memory exhaustion.

### [Medium Impact] Testing — Validation of Functionality
- Comprehensive automated test suite executed via `npm test` (`node --test` + `tsx`).
- 29 unit and security regression tests covering:
  - Unicode homograph attacks and Punycode
  - Typosquatting and Levenshtein distance
  - ReDoS linear timing bounds (< 10ms under 10k adversarial chars)
  - PII redaction of emails, phones, credit cards (Luhn validated), and OTPs
  - Social engineering urgency and credential harvesting
  - Prototype-pollution defense and prompt-isolation boundaries

### [Low Impact] Accessibility — Inclusive & Usable Design
- Full WCAG 2.1 AA/AAA compliance:
  - Visible-on-focus **Skip to main content** link.
  - Semantic HTML5 landmarks (`<header>`, `<nav>`, `<aside>`, `<main id="main-content">`, `<section>`).
  - Strict non-color-only threat indicators (always pairs semantic colors with distinct icons and explicit textual labels).
  - Explicit `<label htmlFor="...">` bindings on all form inputs.
  - ARIA attributes: `role="switch"`, `aria-checked`, `aria-live="polite"`, `role="region"`.
  - Full keyboard navigability with visible `:focus-visible` outlines.
  - Respects `prefers-reduced-motion: reduce`.

---

## 6. How Your Work is Evaluated

| Evaluation Tier | Focus Criteria | SafeCheck Implementation & Validation |
| --- | --- | --- |
| **High Impact** | **Problem Statement Alignment** | Directly delivers Detect, Prevent, and Educate pillars for scams, phishing, and unsafe links without causing harm. |
| **High Impact** | **Security Posture** | Zero-execution link parsing, client-side PII redaction, ReDoS-safe linear regexes, prototype pollution defense, prompt injection boundaries. |
| **Medium Impact** | **Testing Suite** | 29 passing automated unit & security regression tests (`npm test`) with 100% pass rate. |
| **Medium Impact** | **Code Quality** | Strict modular TypeScript (`npm run lint`), pure security algorithms, clean separation of concerns. |
| **Medium Impact** | **Efficiency & Performance** | Sub-5ms heuristic latency, optimized Vite bundle, in-memory Map rate limiter, lightweight footprint (< 2 MB). |
| **Low Impact** | **Accessibility (a11y)** | WCAG AAA contrast, semantic landmarks, skip link, accessible ARIA switches, non-color-only signals, keyboard friendly. |
| **Low Impact** | **UI/UX Polish** | Sleek cybersecurity workbench, animated landing page with live attack simulations, top-rail New Scan button, 4-level Scam Drills, emergency triage playbooks. |

---

## 7. Quickstart Guide

### Prerequisites
- Node.js >= 18.19 (Node 20 or 22 recommended)
- npm >= 9

### Installation
```bash
git clone https://github.com/Devsonar19/SafeCheck.git
cd SafeCheck
npm install --legacy-peer-deps
```

### Running Tests
```bash
npm test
```

### Running Static Type Check / Linter
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

### Starting the Server
```bash
# Optional: Set GEMINI_API_KEY for hybrid AI analysis
export GEMINI_API_KEY="your-gemini-api-key"

# Start the application
npm run dev
# or for production server:
# npx tsx server.ts
```
The application will be live at `http://localhost:3000`.
