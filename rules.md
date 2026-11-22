# Engineering, Security & Compliance Rules — SafeCheck

Every change in this repository must comply with the PromptWars hackathon constraints and engineering standards below.

## 1. Repository & Hackathon Constraints
1. **Repository Size `< 10 MB`**: Never commit `node_modules/`, `dist/`, build caches, large media files, or unused packages. Keep total tracked source size lean (`< 2 MB`).
2. **Single Branch Only**: Work strictly on `main`. Do not create or push auxiliary Git branches.
3. **Public Repository Hygiene**: Never commit `.env`, API keys, tokens, or personal credentials. Only `.env.example` with empty/placeholder values may be committed.
4. **Defensive-Only Mandate**: All features must protect, educate, or warn users safely. Zero offensive tooling, payload generators, or outbound scanning of third-party hosts.

## 2. Security Coding Rules (100/100 Security Rubric)
1. **Server-Only Secrets**: Access `process.env.GEMINI_API_KEY` exclusively inside `server.ts`. Never expose secrets via `VITE_*` variables or client bundles.
2. **Zero Untrusted Execution**: Never fetch user-submitted URLs on the server or browser, and never render untrusted URLs as clickable `<a href>` links.
3. **Safe DOM Rendering**: Use React's default text escaping everywhere. Prohibit `dangerouslySetInnerHTML`, `innerHTML`, `eval`, and `new Function`.
4. **Input Validation & Prototype Pollution Prevention**: Validate all `/api/*` request bodies strictly for types, lengths, allowed enums, and reject forbidden object keys (`__proto__`, `constructor`, `prototype`).
5. **ReDoS-Safe Regular Expressions**: All regexes in `urlAnalyzer.ts`, `messageAnalyzer.ts`, and `piiRedactor.ts` must execute in linear time without catastrophic backtracking; verified by adversarial 10,000-char timing tests.
6. **Unicode Homograph Defense**: Normalize and inspect URLs for mixed scripts, Cyrillic/Greek confusable characters (e.g., `ѕpotify.com`), and Punycode (`xn--`).
7. **Cryptographic IDs**: Use `crypto.randomUUID()` instead of `Math.random()` for scan and request identifiers.
8. **Hardened Rate Limiting & Headers**: Store rate-limit counters in a `Map` (immune to prototype collisions), avoid blindly trusting spoofed IP headers, and send `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, and `Cache-Control: no-store` on API responses.
9. **Prompt Injection Isolation**: Wrap untrusted text inside explicit `<untrusted_submission>` tags and instruct the AI model strictly to evaluate content as data, never as commands.

## 3. Code Quality & Efficiency Rules
1. **Strict TypeScript**: Zero TypeScript compiler errors (`npm run lint` / `tsc --noEmit`). Avoid `any`.
2. **Pure Core Logic**: Keep security parsers and scoring rules pure and framework-agnostic inside `src/lib/` so they run in `< 5 ms` and remain cleanly testable.
3. **Fast AI Configuration**: Use `gemini-4-hydrogen` with `ThinkingLevel.LOW` and structured `responseSchema` for fast, predictable JSON responses.
4. **Honest Error Propagation**: Surface real API errors cleanly; never mask failed AI calls with fabricated responses.

## 4. Testing Rules
1. Every deterministic analyzer, redactor, score-fusion helper, and server request validator must have automated Vitest unit tests in `/tests/`.
2. Security regression tests must explicitly assert Unicode homograph detection, ReDoS latency bounds, prototype-pollution rejection, and invalid MIME/size rejection.

## 5. Accessibility Rules (WCAG 2.1 AA/AAA)
1. Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`) and a visible-on-focus **Skip to main content** link.
2. Full keyboard navigability with clear `:focus-visible` outlines and `>= 44px` touch targets on interactive controls.
3. Never communicate threat severity by color alone—always combine semantic color, icon, and explicit text label (`Safe`, `Caution`, `High Risk`).
4. Announce scan results via `aria-live="polite"` and form errors via `role="alert"`.
5. Respect `prefers-reduced-motion: reduce`.
