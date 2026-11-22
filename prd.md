# Product Requirements Document (PRD) — SafeCheck

## 1. Executive Summary
**SafeCheck** is a privacy-first defensive security workbench built for the **PromptWars: Defence and Security** hackathon. It protects everyday users, students, and small teams from phishing links, social-engineering scam messages, and deceptive screenshots without ever visiting untrusted URLs or exposing personal data.

## 2. Problem Statement Alignment
PromptWars asks for a defensive solution that protects people, data, or systems by detecting, preventing, and raising awareness about threats such as scams, unsafe links, and fake content—keeping users safer without harming anyone.

SafeCheck directly addresses all three defensive pillars:
1. **Detect**: Instant deterministic threat heuristics (< 5 ms) fused with fast multimodal AI reasoning (`gemini-4-hydrogen` at low thinking latency) across URLs, SMS/email text, and screenshots.
2. **Prevent**: Zero-execution URL inspection (untrusted links are parsed strictly as inert strings, never fetched or rendered as clickable anchors), automatic client-side PII redaction before optional AI analysis, and actionable step-by-step defensive checklists.
3. **Raise Awareness**: Interactive **Scam Drills** ("Spot the Scam") and a practical **Safety Guide** that teach users to identify homograph domains, urgency tactics, and credential-harvesting patterns.

## 3. Target Users
- Everyday internet users evaluating suspicious SMS texts, emails, or QR-code links.
- Students and staff verifying unexpected login prompts, invoices, or delivery alerts.
- Hackathon judges auditing code quality, security posture, runtime efficiency, automated test coverage, and WCAG accessibility.

## 4. Functional Requirements

### 4.1 Multi-Modal Threat Inspector
- **Link Mode**: Dissects raw URLs for Unicode/IDN confusable homograph attacks (e.g., Cyrillic `ѕpotify.com`), Punycode (`xn--`), Levenshtein brand typosquatting, `@` userinfo traps, raw IP hosts, risky TLDs, excessive subdomains, open-redirect query parameters, and missing HTTPS.
- **Message Mode**: Analyzes email/SMS copy for social-engineering urgency, credential/OTP harvesting, wire/gift-card/crypto coercion, brand-impersonation mismatches, and automatically inspects all embedded URLs.
- **Screenshot Mode**: Accepts validated PNG, JPEG, or WebP screenshots (<= 4 MB) and inspects visual spoofing indicators (forged headers, coercive payment prompts, mismatched domains, QR lures) via server-side Gemini multimodal analysis.
- **Privacy Shield (PII Redaction)**: Automatically detects and masks emails, phone numbers, payment card digits, SSN-like numbers, and 6-digit OTP codes before sending text to the AI endpoint or saving to local history.
- **Hybrid + Local-Only Execution**: Deterministic engine runs immediately in the browser; optional fast AI deep analysis runs via `/api/analyze`. Users can toggle Local-Only mode at any time.

### 4.2 Interactive Scam Drills
- Curated, harmless scenarios spanning lookalike URLs, urgent SMS lures, fake billing emails, and legitimate reference messages.
- Immediate feedback explaining exact red flags or trust indicators, with local mastery tracking.

### 4.3 Privacy-First Local Scan History
- Stored strictly in browser `localStorage` with runtime schema validation (no login required, no third-party tracking).
- Live search, verdict filtering (`All`, `High Risk`, `Caution`, `Safe`), one-click report reopening, sanitized JSON/text export, and inline-confirmed history purge.

### 4.4 Practical Safety Guide
- Concise defensive playbooks for verifying suspicious messages, recognizing homograph links, and recovering safely if a user already clicked a link or shared a password.

## 5. Non-Functional Requirements & Compliance Standards
| Criterion | Target Standard |
| --- | --- |
| **Repository Size** | Strictly `< 10 MB` (target `< 2 MB` excluding `node_modules`) |
| **Git Hygiene** | Public repository, single branch only (`main`) |
| **Code Quality** | Strict TypeScript (`tsc --noEmit`), modular pure-function engines, clean separation of concerns |
| **Security** | Server-only API keys, strict input & MIME validation, ReDoS-safe regexes, prototype-pollution guards, Map-based rate limiting, defensive HTTP headers, zero XSS/SSRF sinks |
| **Efficiency** | Sub-5ms local deterministic analysis; fast `gemini-4-hydrogen` (`ThinkingLevel.LOW`) server inference |
| **Testing** | Automated Vitest suite covering URL, message, PII redactor, score fusion, and server validation edge cases |
| **Accessibility** | WCAG 2.1 AA/AAA contrast, skip-to-content link, semantic landmarks, keyboard navigation, `aria-live` announcements, non-color-only status cues, `prefers-reduced-motion` |

## 6. Out of Scope (Defensive Boundary)
- No active port scanning, exploitation payloads, credential harvesting, or outbound crawling of user-submitted targets.
