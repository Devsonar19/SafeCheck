import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Cpu,
  Clock,
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';
import { OverallThreatVerdict, ThreatSeverity } from '../lib/types';

interface VerdictPanelProps {
  verdict: OverallThreatVerdict;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({ verdict }) => {
  const [copied, setCopied] = useState(false);

  const getVerdictStyle = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'high-risk':
        return {
          bg: 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800',
          badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200 border-red-200 dark:border-red-700',
          textColor: 'text-red-900 dark:text-red-100',
          subColor: 'text-red-700 dark:text-red-300',
          barColor: 'bg-red-600',
          icon: ShieldAlert,
          label: 'HIGH RISK — SUSPECTED SCAM / PHISHING',
        };
      case 'caution':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800',
          badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border-amber-200 dark:border-amber-700',
          textColor: 'text-amber-900 dark:text-amber-100',
          subColor: 'text-amber-700 dark:text-amber-300',
          barColor: 'bg-amber-500',
          icon: AlertTriangle,
          label: 'CAUTION — SUSPICIOUS INDICATORS FOUND',
        };
      case 'safe':
      default:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800',
          badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700',
          textColor: 'text-emerald-900 dark:text-emerald-100',
          subColor: 'text-emerald-700 dark:text-emerald-300',
          barColor: 'bg-emerald-600',
          icon: ShieldCheck,
          label: 'SAFE — NO MALICIOUS SIGNATURES DETECTED',
        };
    }
  };

  const style = getVerdictStyle(verdict.severity);
  const Icon = style.icon;

  const handleCopyReport = () => {
    const reportText = `[SafeCheck Verdict Report]
Verdict: ${verdict.severity.toUpperCase()} (Score: ${verdict.score}/100)
Target: ${verdict.redactedInput}
Summary: ${verdict.summary}
Signals: ${verdict.signals.map(s => s.title).join(', ') || 'None'}
Action: ${verdict.recommendedActions.join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="region"
      aria-label="Threat Analysis Verdict"
      className="space-y-6"
    >
      {/* Primary High-Contrast Verdict Banner */}
      <div className={`rounded-2xl border p-6 transition-all shadow-xs ${style.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`rounded-xl p-3 shrink-0 ${style.badgeBg}`}>
              <Icon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${style.badgeBg}`}>
                  {style.label}
                </span>
                {verdict.piiMasked && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    <Lock className="h-3 w-3" aria-hidden="true" />
                    PII Masked
                  </span>
                )}
                {verdict.hybridMode && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    <Cpu className="h-3 w-3" aria-hidden="true" />
                    Gemini AI Reasoned
                  </span>
                )}
              </div>
              <h2 className={`mt-2 text-xl font-extrabold ${style.textColor}`}>
                {verdict.summary}
              </h2>
            </div>
          </div>

          {/* Numeric Score Gauge */}
          <div className="flex flex-col items-end shrink-0 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-800">
            <div className="text-right">
              <span className="text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                {verdict.score}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/100</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Risk Score
            </span>
            <div className="mt-1.5 h-2 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full ${style.barColor}`}
                style={{ width: `${Math.max(5, verdict.score)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Telemetry metadata footer */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Latency: {verdict.executionTimeMs} ms
            </span>
            <span>Confidence: {verdict.confidence}%</span>
            <span>Mode: {verdict.hybridMode ? 'Hybrid AI + Heuristic' : 'Deterministic Local-Only'}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>
        </div>
      </div>

      {/* Target Content Dissection (Monospace Technical Inspector) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Inspected Target (Inert String Display — Zero Click Sink)
        </h3>
        <div className="mt-2 rounded-xl bg-slate-900 p-3.5 font-mono text-xs text-emerald-400 dark:bg-black selection:bg-blue-600 selection:text-white break-all">
          {verdict.redactedInput || 'No input content'}
        </div>
      </div>

      {/* Detected Signals Breakdown */}
      {verdict.signals.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Detected Threat Signals ({verdict.signals.length})
          </h3>
          <div className="space-y-2.5">
            {verdict.signals.map((sig) => {
              const isHigh = sig.severity === 'high-risk';
              const isCaution = sig.severity === 'caution';
              return (
                <div
                  key={sig.id}
                  className={`flex items-start gap-3 rounded-xl p-3 border ${
                    isHigh
                      ? 'border-red-200 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/20'
                      : isCaution
                      ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/20'
                      : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isHigh ? (
                      <ShieldAlert className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                    ) : isCaution ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                    ) : (
                      <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {sig.title}
                      </span>
                      <span className="rounded bg-slate-200/80 px-1.5 py-0.2 text-[10px] font-mono uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {sig.category}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      {sig.description}
                    </p>
                    {sig.evidence && (
                      <p className="mt-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 rounded px-2 py-0.5 inline-block">
                        Evidence: {sig.evidence}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Reasoning Insight (If Hybrid Mode Active) */}
      {verdict.aiInsight && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-5 dark:border-purple-900/60 dark:bg-purple-950/20 shadow-xs">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
              Gemini AI Semantic Analysis
            </h3>
          </div>
          <p className="mt-2 text-xs text-purple-950 dark:text-purple-200 leading-relaxed">
            {verdict.aiInsight}
          </p>
        </div>
      )}

      {/* Actionable Defensive Recommendations Checklist */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Recommended Defensive Actions
        </h3>
        <ul className="mt-3 space-y-2">
          {verdict.recommendedActions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" aria-hidden="true" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
