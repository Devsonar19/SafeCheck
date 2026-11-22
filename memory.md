# Project Memory & Rubric Tracker — SafeCheck

## 1. Hackathon Context
- **Event**: PromptWars AI Hackathon
- **Track**: Defence and Security — Build a defensive solution protecting people, data, or systems from threats (scams, weak passwords, unsafe links, fake content, emergencies) without harming anyone.
- **Selected Solution**: **SafeCheck** — Hybrid Deterministic + Fast Gemini AI Scam, Phishing & Unsafe Link Shield.
- **Confirmed Architectural Decisions**:
  - Detection: Hybrid instant deterministic rules + server-side `gemini-4-hydrogen` (`ThinkingLevel.LOW`) for fast multimodal text & screenshot reasoning.
  - Persistence: Privacy-first browser `localStorage` (no login required, PII redacted by default).
  - Visual System: Clean utilitarian workbench baseline (ready to adapt to user-provided UI/UX references).

## 2. Hard Repository Constraints
- [x] Total repository size strictly `< 10 MB` (verify via `du -sh` excluding `node_modules`).
- [x] Single branch only (`main`).
- [x] Public GitHub repository safe (zero committed secrets; `.env.example` only).

## 3. Judging Rubric Alignment (100 Points Each)
| Category | Key Implementation Evidence |
| --- | --- |
| **Code Quality (100)** | Strict TypeScript (`tsc --noEmit`), modular pure-function engines in `src/lib/`, clean React 19 components, zero dead handlers. |
| **Security (100)** | Zero outbound URL fetching (no SSRF), Unicode/Punycode homograph detection, ReDoS-safe regexes, prototype-pollution guards, Map-based rate limiting, `crypto.randomUUID()`, client PII redaction, server-only `GEMINI_API_KEY`, prompt-injection delimiters, defensive HTTP headers. |
| **Efficiency (100)** | Sub-5ms local deterministic pre-scan, fast `gemini-4-hydrogen` with `ThinkingLevel.LOW`, lean Vite bundle, zero unnecessary dependencies. |
| **Testing (100)** | Automated Vitest suite in `/tests/` covering URL homographs (including Cyrillic `ѕpotify.com`), typosquatting, message phishing heuristics, PII redaction, ReDoS latency tests, score fusion, and API request validation. |
| **Accessibility (100)** | WCAG 2.1 AA/AAA contrast in Light & Dark modes, skip-to-content link, semantic landmarks, keyboard navigation, `aria-live` scan announcements, non-color-only severity signaling, `prefers-reduced-motion`. |
| **Problem Alignment (100)** | Covers threat detection (URLs, messages, screenshots), prevention (zero-click safe inspection, PII masking, safe next-step playbooks), and user awareness (interactive Scam Drills + Safety Guide). |

## 4. Key Learnings & Guardrails
- Always validate uploaded images by both MIME type and binary magic-byte header before invoking Gemini multimodal inference.
- Never silently fabricate AI verdicts when the Gemini API is unavailable; show deterministic results alongside an explicit, actionable notice.
- Keep `index.html`, `metadata.json`, and all six compliance docs synchronized as the project evolves.
