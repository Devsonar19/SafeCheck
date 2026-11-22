# System Architecture — SafeCheck

## 1. Architectural Overview
SafeCheck follows a **Hybrid Local-First + Thin Secure Proxy** architecture. All deterministic threat inspection and PII redaction execute locally in pure TypeScript modules with zero network latency, while optional deep semantic and multimodal screenshot reasoning executes through a hardened Express API proxy calling Google Gemini (`gemini-4-hydrogen` with `ThinkingLevel.LOW`).

```text
┌───────────────────────────────────────────────────────────────────────────┐
│                    Browser Client (React 19 + Tailwind v4)                │
│                                                                           │
│  ┌─────────────────┐    ┌───────────────────────────────────────────────┐ │
│  │ App Shell       │    │ Workspace Views                               │ │
│  │ • Skip Link     │    │ • ThreatInspector (Link / Message / Image)    │ │
│  │ • Sidebar Rail  │───▶│ • VerdictPanel (Score, Signals, AI, Actions)  │ │
│  │ • TopBar        │    │ • ScamDrills (Interactive Awareness Trainer)  │ │
│  │ • Theme Context │    │ • ScanHistory (Local Ledger + Export)         │ │
│  └─────────────────┘    │ • SafetyGuide (Defensive Playbooks)           │ │
│                         └───────────────────────┬───────────────────────┘ │
│                                                 │                         │
│  ┌──────────────────────────────────────────────▼───────────────────────┐ │
│  │ Shared Pure-TypeScript Security Engine (src/lib/)                    │ │
│  │ • urlAnalyzer.ts       (Unicode homographs, Punycode, typosquatting) │ │
│  │ • messageAnalyzer.ts   (Social engineering & embedded link triage)   │ │
│  │ • piiRedactor.ts       (ReDoS-safe PII detection & masking)          │ │
│  │ • threatEngine.ts      (Deterministic scoring + hybrid AI fusion)    │ │
│  │ • storage.ts           (Validated localStorage persistence)          │ │
│  └──────────────────────────────────────────────┬───────────────────────┘ │
└─────────────────────────────────────────────────┼─────────────────────────┘
                                                  │ POST /api/analyze (Redacted JSON / Image)
                                                  ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                   Express Server Proxy (server.ts, Port 3000)             │
│                                                                           │
│  1. Security Headers Middleware (nosniff, no-referrer, no-store on /api)  │
│  2. Map-Based Per-IP Rate Limiter (sliding window, safe remoteAddress)    │
│  3. requestValidation.ts (strict types, length caps, MIME + magic bytes,  │
│     prototype-pollution key guard)                                        │
│  4. Prompt-Injection Boundary (<untrusted_submission> framing)            │
│  5. @google/genai SDK -> gemini-4-hydrogen (ThinkingLevel.LOW + JSON      │
│     responseSchema) via server-only process.env.GEMINI_API_KEY            │
└───────────────────────────────────────────────────────────────────────────┘
```

## 2. Project Structure
- `/server.ts` — Express server entry point mounting security middleware, `/api/health`, `/api/analyze`, and Vite dev middleware (or static `dist/` in production).
- `/src/lib/` — Pure TypeScript security engines, validators, drill dataset, sample payloads, and validated `localStorage` helpers (100% unit-testable without DOM or network dependencies).
- `/src/components/` — Accessible, modular React UI components (`Sidebar`, `TopBar`, `ThreatInspector`, `VerdictPanel`, `ScamDrills`, `ScanHistory`, `SafetyGuide`).
- `/tests/` — Vitest unit and security test suite verifying deterministic parsers, ReDoS bounds, Unicode homograph spoofing, PII redaction, score fusion, and server validation.
- `/prd.md`, `/architecture.md`, `/rules.md`, `/phases.md`, `/design.md`, `/memory.md` — Project governance and hackathon compliance documentation.

## 3. Data Flow & Security Boundaries

### 3.1 Threat Inspection Lifecycle
1. User enters a URL, message, or uploads a screenshot (`<= 4 MB`, PNG/JPEG/WebP).
2. `piiRedactor.ts` scans text locally and masks emails, phone numbers, card numbers, SSN patterns, and OTP codes if Privacy Shield is active (default: ON).
3. `threatEngine.ts` runs `urlAnalyzer.ts` / `messageAnalyzer.ts` synchronously (`< 5 ms`), rendering an immediate deterministic verdict and evidence list.
4. If Hybrid AI is enabled, the client sends the **redacted** text or validated base64 image plus deterministic signal summaries to `POST /api/analyze`.
5. `server.ts` validates payload shape, rejects prototype-pollution keys, verifies image magic bytes, applies rate limiting, and queries `gemini-4-hydrogen` (`ThinkingLevel.LOW`) using strict `responseSchema`.
6. The client fuses deterministic and AI findings via `fuseThreatReport()`, announces the verdict in an `aria-live="polite"` region, and persists the redacted report to `localStorage`.

### 3.2 Failure Resilience
- If `GEMINI_API_KEY` is unavailable or the upstream API times out/errors, `/api/analyze` returns an explicit structured HTTP error (`503`/`502`/`429`).
- The UI displays a clear, calm notice explaining why AI enrichment did not complete while preserving all deterministic findings intact—never fabricating fake AI output.

## 4. Compliance Verification
- **Zero SSRF**: Untrusted URLs are never fetched by browser or server.
- **Zero Client Secrets**: `@google/genai` is imported exclusively in `server.ts`.
- **Single-Branch & `< 10 MB` Footprint**: Minimal dependency tree; no heavy binary assets or database servers bundled into git.
