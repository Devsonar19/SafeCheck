# Implementation Phases — SafeCheck

## Phase 1: Governance, Tooling & Compliance Foundation
- Define product scope, architecture, design tokens, rules, and rubric memory (`prd.md`, `architecture.md`, `rules.md`, `phases.md`, `design.md`, `memory.md`).
- Upgrade `@google/genai` to support `gemini-4-hydrogen` (`ThinkingLevel.LOW`) and install `vitest`.
- Configure `metadata.json`, `index.html`, `src/index.css` (Tailwind v4 + `@custom-variant dark`), and npm scripts (`dev`, `start`, `build`, `lint`, `test`).

## Phase 2: Deterministic Security Engine & Validation Layer
- Build `src/lib/types.ts` with strict domain interfaces.
- Build `src/lib/piiRedactor.ts` (linear-time email, phone, card, SSN, and OTP masking).
- Build `src/lib/urlAnalyzer.ts` (Unicode/Cyrillic/Greek homograph confusables, Punycode `xn--`, Levenshtein typosquatting, IP hosts, `@` credential traps, risky TLDs, open-redirect parameters).
- Build `src/lib/messageAnalyzer.ts` (urgency coercion, credential/OTP harvesting, payment/crypto lures, embedded URL extraction).
- Build `src/lib/threatEngine.ts` (deterministic scoring + hybrid AI fusion) and `src/lib/requestValidation.ts` (strict server payload & magic-byte MIME validator + prototype-pollution guard).

## Phase 3: Hardened Express Server & Fast Gemini AI Proxy
- Build `server.ts` serving Vite dev middleware / static production bundle on port `3000`.
- Implement security headers middleware, Map-based sliding-window rate limiter, `/api/health`, and `/api/analyze`.
- Wire `@google/genai` server-side client using `gemini-4-hydrogen` with `ThinkingLevel.LOW`, `responseSchema`, `User-Agent: aistudio-build`, and prompt-injection delimiters.

## Phase 4: Accessible Workbench UI & Awareness Modules
- Build responsive App Shell (`Sidebar`, `TopBar`, skip-to-content link, Light/Dark theme persistence).
- Build `ThreatInspector` (Link / Message / Screenshot modes, Privacy Shield live redaction preview, safe one-click test payloads, Hybrid vs Local-Only control).
- Build `VerdictPanel` (tabular risk gauge, non-color-only severity badges, deterministic signals, AI analysis breakdown, safe action checklist, JSON/text export).
- Build `ScamDrills` (interactive "Spot the Scam" trainer), `ScanHistory` (searchable local ledger with inline-confirmed clear), and `SafetyGuide`.

## Phase 5: Automated Testing, Security Verification & Polish
- Write comprehensive Vitest unit and security suites in `/tests/`.
- Run `npm test`, `npm run lint`, and production build verification.
- Verify repository footprint (`< 10 MB`), single-branch hygiene, contrast ratios, keyboard flow, and live API behavior.
