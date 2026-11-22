import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Shield
} from 'lucide-react';
import { OverallThreatVerdict, ThreatSeverity } from '../lib/types';

interface VerdictPanelProps {
  verdict: OverallThreatVerdict;
}

export const VerdictPanel: React.FC<VerdictPanelProps> = ({ verdict }) => {
  const [copied, setCopied] = useState(false);

  const getVerdictTheme = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'high-risk':
        return {
          containerBorder: 'border-red-300 dark:border-red-900',
          containerBg: 'bg-red-50/50 dark:bg-red-950/20',
          iconBg: 'bg-red-600 text-white',
          titleColor: 'text-red-950 dark:text-red-100',
          labelColor: 'text-red-700 dark:text-red-300',
          barColor: 'bg-red-600',
          icon: ShieldAlert,
          label: 'High Risk Threat Detected',
        };
      case 'caution':
        return {
          containerBorder: 'border-amber-300 dark:border-amber-900',
          containerBg: 'bg-amber-50/50 dark:bg-amber-950/20',
          iconBg: 'bg-amber-600 text-white',
          titleColor: 'text-amber-950 dark:text-amber-100',
          labelColor: 'text-amber-700 dark:text-amber-300',
          barColor: 'bg-amber-500',
          icon: AlertTriangle,
          label: 'Caution Advised',
        };
      case 'safe':
      default:
        return {
          containerBorder: 'border-emerald-300 dark:border-emerald-900',
          containerBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
          iconBg: 'bg-emerald-600 text-white',
          titleColor: 'text-emerald-950 dark:text-emerald-100',
          labelColor: 'text-emerald-700 dark:text-emerald-300',
          barColor: 'bg-emerald-600',
          icon: ShieldCheck,
          label: 'Safe — No Threats Found',
        };
    }
  };

  const theme = getVerdictTheme(verdict.severity);
  const Icon = theme.icon;

  const handleCopyReport = () => {
    const reportText = `[SafeCheck Inspection Report]
Verdict: ${verdict.severity.toUpperCase()} (Score: ${verdict.score}/100)
Target: ${verdict.redactedInput}
Summary: ${verdict.summary}
Signals: ${verdict.signals.map(s => s.title).join('; ') || 'None'}
Actions:
${verdict.recommendedActions.map(a => `• ${a}`).join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div role="region" aria-label="Inspection Verdict" className="space-y-6">
      {/* Primary Verdict Banner: Outer rounded-xl (12px) */}
      <div className={`rounded-xl border p-6 ${theme.containerBorder} ${theme.containerBg} shadow-xs`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${theme.iconBg}`}>
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${theme.labelColor}`}>
                {theme.label}
              </span>
              <h2 className={`mt-1 text-lg font-bold ${theme.titleColor} text-wrap:balance`}>
                {verdict.summary}
              </h2>
            </div>
          </div>

          {/* Tabular Score Display */}
          <div className="flex flex-col sm:items-end shrink-0 sm:pl-5 sm:border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {verdict.score}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Risk Score
            </span>
            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className={`h-full ${theme.barColor}`}
                style={{ width: `${Math.max(4, verdict.score)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Telemetry metadata footer */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 tabular-nums">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {verdict.executionTimeMs} ms latency
            </span>
            <span className="tabular-nums">Confidence {verdict.confidence}%</span>
            <span>{verdict.piiMasked ? 'PII Protected' : 'No PII'}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1.5 py-0.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Report'}</span>
          </button>
        </div>
      </div>

      {/* Inspected Target String: Mono font strictly used for data */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Inspected Target
        </span>
        <div className="rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400 dark:bg-slate-950 break-all select-all">
          {verdict.redactedInput || 'No input content'}
        </div>
      </div>

      {/* Identified Threat Signals */}
      {verdict.signals.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Identified Threat Signals ({verdict.signals.length})
          </span>
          <div className="space-y-2.5">
            {verdict.signals.map((sig) => {
              const isHigh = sig.severity === 'high-risk';
              const isCaution = sig.severity === 'caution';
              return (
                <div
                  key={sig.id}
                  className={`flex items-start gap-3 rounded-lg border p-3.5 ${
                    isHigh
                      ? 'border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20'
                      : isCaution
                      ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
                      : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850'
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
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {sig.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                      {sig.description}
                    </p>
                    {sig.evidence && (
                      <p className="mt-1 font-mono text-[11px] text-slate-700 dark:text-slate-300">
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

      {/* AI Semantic Reasoning (If Active) */}
      {verdict.aiInsight && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 dark:border-blue-900/50 dark:bg-blue-950/20 shadow-xs space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">
            Semantic Intelligence
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {verdict.aiInsight}
          </p>
        </div>
      )}

      {/* Recommended Defensive Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Recommended Defensive Steps
        </span>
        <ul className="space-y-2">
          {verdict.recommendedActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" aria-hidden="true" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
