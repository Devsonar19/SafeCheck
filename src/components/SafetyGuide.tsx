import React, { useState } from 'react';
import {
  BookOpenCheck,
  AlertOctagon,
  AlertTriangle,
  FileCheck2
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
    <div className="mx-auto max-w-5xl space-y-8 py-2">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Defensive Safety Guide &amp; Incident Playbooks
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Immediate containment workflows and practical hardening playbooks to recover from cyber incidents safely.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: EMERGENCY INCIDENT RESPONSE PLAYBOOKS */}
      <section aria-labelledby="emergency-heading" className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
          <h2 id="emergency-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Emergency Incident Containment (First 5 Minutes)
          </h2>
        </div>

        {/* Emergency Tabs: Outer rounded-xl (12px), p-1 (4px), Inner rounded-lg (8px) */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
          {EMERGENCY_GUIDES.map(guide => {
            const isActive = selectedEmergency === guide.id;
            return (
              <button
                key={guide.id}
                type="button"
                onClick={() => setSelectedEmergency(guide.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-white text-red-700 shadow-xs dark:bg-slate-800 dark:text-red-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>{guide.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Emergency Card: Outer rounded-xl (12px), p-6 (24px) */}
        <div className="rounded-xl border border-red-200 bg-linear-to-b from-red-50/50 to-white p-6 dark:border-red-900/60 dark:from-red-950/20 dark:to-slate-900 shadow-xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {activeEmergency.title}
            </h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {activeEmergency.subtitle}
            </p>
          </div>

          <div className="space-y-3">
            {activeEmergency.steps.map((st) => (
              <div
                key={st.step}
                className="flex items-start gap-3.5 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/90 shadow-xs"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-600 text-xs font-bold text-white">
                  {st.step}
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {st.action}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                    {st.details}
                  </p>
                  {st.caution && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-md bg-amber-50 p-2 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                      <span>Caution: {st.caution}</span>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SAFETY_MODULES.map((mod) => (
            <div
              key={mod.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs"
            >
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {mod.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  {mod.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Defensive Rules
                  </span>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {mod.keyRules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">•</span>
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

      {/* SECTION 3: INTERACTIVE PERSONAL DEFENSE CHECKLIST: Outer rounded-xl (12px), p-6 (24px) */}
      <section aria-labelledby="checklist-heading" className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <h2 id="checklist-heading" className="text-lg font-bold text-slate-900 dark:text-white">
                Personal Cyber Defense Checklist
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Interactive baseline hardening checklist to protect your digital identity across devices.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex flex-col sm:items-end shrink-0">
            <span className="tabular-nums text-xs font-semibold text-slate-700 dark:text-slate-300">
              {completedCount} of {DEFENSIVE_CHECKLIST.length} Hardened ({progressPercent}%)
            </span>
            <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {DEFENSIVE_CHECKLIST.map((item) => {
            const isDone = Boolean(checkedItems[item.id]);
            return (
              <label
                key={item.id}
                htmlFor={item.id}
                className={`flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors ${
                  isDone
                    ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/60 dark:border-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  id={item.id}
                  type="checkbox"
                  checked={isDone}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-800"
                />
                <div className="space-y-0.5 min-w-0 flex-1">
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
