import React from 'react';
import {
  Lock,
  ArrowRight,
  Search,
  CheckCircle2,
  Play
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface AnimatedLandingProps {
  onStartScan: () => void;
  onLoadSample: (type: 'url' | 'message', sampleText: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const AnimatedLanding: React.FC<AnimatedLandingProps> = ({
  onStartScan,
  onLoadSample,
  setActiveTab,
}) => {
  return (
    <div className="mx-auto max-w-6xl space-y-10 py-2">
      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-blue-50/60 via-white to-slate-50/40 p-8 sm:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 shadow-xs">
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-3.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
            PromptWars Defence &amp; Security Solution
          </div>

          {/* Heading */}
          <h1 id="hero-heading" className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Inspect Phishing Links, Scams &amp; Deceptive Media <br className="hidden sm:inline" />
            <span className="text-blue-600 dark:text-blue-400">
              Without Ever Clicking Them.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300 leading-relaxed">
            SafeCheck is a privacy-first defensive security workbench. It dissects Unicode homographs, social engineering urgency, and spoofed screenshots using sub-5ms deterministic rules fused with Google Gemini reasoning.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onStartScan}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 active:bg-blue-800"
            >
              <span>Launch Threat Inspector</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('drills')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <span>Practice Scam Drills (4 Levels)</span>
            </button>
          </div>

          {/* Defense Telemetry Ticker */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-200/80 pt-6 sm:grid-cols-4 dark:border-slate-800 w-full max-w-3xl">
            <div className="p-2">
              <span className="block text-xl font-bold tabular-nums text-blue-600 dark:text-blue-400">0 Clicks</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Zero-Execution Link Parsing</span>
            </div>
            <div className="p-2">
              <span className="block text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">&lt; 5 ms</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Deterministic Engine Latency</span>
            </div>
            <div className="p-2">
              <span className="block text-xl font-bold tabular-nums text-blue-600 dark:text-blue-400">100%</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Client-Side PII Privacy Shield</span>
            </div>
            <div className="p-2">
              <span className="block text-xl font-bold text-slate-700 dark:text-slate-300">WCAG AAA</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">High-Contrast Accessible Design</span>
            </div>
          </div>
        </div>
      </section>
      {/* Quick Interactive Demo Section */}
      <section aria-labelledby="live-demo-heading" className="space-y-4">
        <div>
          <h2 id="live-demo-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Instant Attack Simulation Demos
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Click any realistic attack payload below to immediately load and analyze it in the inspector:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Demo 1 */}
          <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600">
            <div>
              <span className="inline-block rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950/80 dark:text-red-300">
                Unicode Homograph
              </span>
              <h3 className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                Spoofed Spotify Cyrillic Lookalike
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                Uses Cyrillic character <code className="rounded bg-slate-100 px-1 font-mono text-red-600 dark:bg-slate-800">ѕ</code> (U+0455) instead of Latin &apos;s&apos; to evade human eyes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onLoadSample('url', 'https://ѕpotify.com/login-verify');
              }}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Simulate Homograph Scan</span>
            </button>
          </div>

          {/* Demo 2 */}
          <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600">
            <div>
              <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                Urgent Smishing
              </span>
              <h3 className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                USPS Package Delivery Redirection
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                Coercive 12-hour urgency demanding a $1.85 fee to harvest card numbers via throwaway .top domain.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onLoadSample(
                  'message',
                  'USPS Urgent Notice: Your package US-892410 is on hold due to missing house number. Pay $1.85 redelivery within 12 hours: https://usps-post-redelivery.top/step1'
                );
              }}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Simulate Smishing Scan</span>
            </button>
          </div>

          {/* Demo 3 */}
          <div className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-colors hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600">
            <div>
              <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800 dark:bg-blue-950/80 dark:text-blue-300">
                PII Privacy Shield
              </span>
              <h3 className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                Credential &amp; OTP Extortion
              </h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                Tests automatic client-side masking of email, phone number, and 6-digit OTP verification codes.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onLoadSample(
                  'message',
                  'Bank Security Alert: Suspicious login from IP 185.220.101.5. Text back your OTP code 940281 and confirm SSN 123-45-6789 to verify identity.'
                );
              }}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Simulate PII Redaction Scan</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Defensive Pillars */}
      <section aria-labelledby="pillars-heading" className="space-y-4">
        <div>
          <h2 id="pillars-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Architected for the Three Defensive Pillars
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Strict alignment with PromptWars guidelines to protect people, data, and systems responsibly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">1. Detect Threats Instantly</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sub-5ms deterministic engine identifies Unicode homographs, Punycode tricks, Levenshtein brand typosquatting, raw IP hosts, and social-engineering urgency keywords before optional AI analysis.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">2. Prevent Exploitation</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero-execution safety guarantee: untrusted URLs are never fetched by server or client and never rendered as clickable anchors. Sensitive PII (emails, cards, OTPs) is masked client-side before submission.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">3. Raise User Awareness</h3>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              4-level interactive Scam Drills train users to recognize homographs, urgent smishing, and QR quishing. Emergency Triage Playbooks guide recovery if credentials were typed or suspicious links clicked.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
