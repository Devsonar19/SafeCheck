import React, { useState } from 'react';
import {
  BookOpenCheck,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  QrCode,
  KeyRound,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { EMERGENCY_GUIDES, SAFETY_MODULES, DEFENSIVE_CHECKLIST } from '../lib/safetyData';

export const SafetyGuide: React.FC = () => {
  const [selectedEmergency, setSelectedEmergency] = useState(EMERGENCY_GUIDES[0].id);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const activeEmergency = EMERGENCY_GUIDES.find(g => g.id === selectedEmergency) || EMERGENCY_GUIDES[0];
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / DEFENSIVE_CHECKLIST.length) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-10 py-2">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Defensive Safety Guide &amp; Incident Playbooks
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Immediate containment workflows and practical hardening playbooks to recover from cyber incidents safely.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: EMERGENCY INCIDENT RESPONSE PLAYBOOKS */}
      <section aria-labelledby="emergency-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
            <h2 id="emergency-heading" className="text-lg font-bold text-slate-900 dark:text-white">
              Emergency Incident Containment (First 5 Minutes)
            </h2>
          </div>
          <span className="rounded-full bg-red-100 px-3 py-0.5 text-xs font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
            Actionable Playbooks
          </span>
        </div>

        {/* Emergency Tabs */}
        <div className="flex rounded-2xl border border-slate-200 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-900">
          {EMERGENCY_GUIDES.map(guide => {
            const isActive = selectedEmergency === guide.id;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => setSelectedEmergency(guide.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-white text-red-700 shadow-xs dark:bg-slate-800 dark:text-red-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{guide.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Emergency Card */}
        <div className="rounded-3xl border border-red-200/80 bg-linear-to-b from-red-50/40 to-white p-6 sm:p-8 dark:border-red-900/60 dark:from-red-950/20 dark:to-slate-900 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Immediate Protocol
            </span>
            <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              {activeEmergency.title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {activeEmergency.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {activeEmergency.steps.map((st) => (
              <div
                key={st.step}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/90 shadow-xs"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white">
                  {st.step}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {st.action}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.details}
                  </p>
                  {st.caution && (
                    <div className="mt-2 rounded-lg bg-amber-50 p-2 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                      ⚠️ Caution: {st.caution}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: DEFENSIVE KNOWLEDGE MODULES */}
      <section aria-labelledby="modules-heading" className="space-y-4">
        <h2 id="modules-heading" className="text-lg font-bold text-slate-900 dark:text-white">
          Defensive Knowledge Modules
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SAFETY_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {mod.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  {mod.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Defensive Rules:
                  </h4>
                  <ul className="mt-2 space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {mod.keyRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE PERSONAL DEFENSE CHECKLIST */}
      <section aria-labelledby="checklist-heading" className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <h2 id="checklist-heading" className="text-xl font-bold text-slate-900 dark:text-white">
                Personal Cyber Defense Checklist
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Interactive baseline hardening checklist to protect your digital identity across devices.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {completedCount} of {DEFENSIVE_CHECKLIST.length} Hardened ({progressPercent}%)
            </span>
            <div className="mt-1.5 h-2 w-36 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEFENSIVE_CHECKLIST.map((item) => {
            const isDone = Boolean(checkedItems[item.id]);
            return (
              <label
                key={item.id}
                htmlFor={item.id}
                className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                  isDone
                    ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  id={item.id}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {item.label}
                    </span>
                    {item.recommended && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        Essential
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    {item.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </section>
    </div>
  );
};
