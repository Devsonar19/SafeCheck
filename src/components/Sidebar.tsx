import React from 'react';
import {
  ShieldAlert,
  Target,
  BookOpen,
  History,
  Plus,
  Sun,
  Moon,
  ShieldCheck,
  X
} from 'lucide-react';

export type ActiveTab = 'scanner' | 'drills' | 'guide' | 'history' | 'landing';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onNewScan: () => void;
  historyCount: number;
  piiRedactionEnabled: boolean;
  setPiiRedactionEnabled: (val: boolean) => void;
  hybridModeEnabled: boolean;
  setHybridModeEnabled: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onNewScan,
  historyCount,
  piiRedactionEnabled,
  setPiiRedactionEnabled,
  hybridModeEnabled,
  setHybridModeEnabled,
  darkMode,
  setDarkMode,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems = [
    {
      id: 'scanner' as ActiveTab,
      label: 'Threat Inspector',
      icon: ShieldAlert,
    },
    {
      id: 'drills' as ActiveTab,
      label: 'Scam Drills',
      icon: Target,
    },
    {
      id: 'guide' as ActiveTab,
      label: 'Safety Guide',
      icon: BookOpen,
    },
    {
      id: 'history' as ActiveTab,
      label: 'Scan History',
      icon: History,
      count: historyCount,
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="main-sidebar"
        aria-label="Application Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform duration-150 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveTab('scanner');
              setMobileOpen(false);
            }}
            className="flex items-center gap-2.5 text-left focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md p-1"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                SafeCheck
              </span>
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Security Workbench
              </span>
            </div>
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        {/* TOP CTA: Prominent New Scan Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewScan();
              setActiveTab('scanner');
              setMobileOpen(false);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>New Inspection</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Main Navigation" className="flex-1 space-y-1 px-3 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="tabular-nums text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Engine Controls Section */}
          <div className="pt-5 pb-1">
            <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Settings
            </span>

            <div className="mt-2 space-y-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-850">
              {/* PII Redaction Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="pii-toggle" className="block text-xs font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
                    PII Redaction
                  </label>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Mask personal data
                  </span>
                </div>
                <button
                  id="pii-toggle"
                  type="button"
                  role="switch"
                  aria-checked={piiRedactionEnabled}
                  onClick={() => setPiiRedactionEnabled(!piiRedactionEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    piiRedactionEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                      piiRedactionEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Hybrid Mode Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label htmlFor="hybrid-toggle" className="block text-xs font-medium text-slate-900 dark:text-slate-100 cursor-pointer">
                    Deep AI Analysis
                  </label>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {hybridModeEnabled ? 'Gemini active' : 'Local only (< 5ms)'}
                  </span>
                </div>
                <button
                  id="hybrid-toggle"
                  type="button"
                  role="switch"
                  aria-checked={hybridModeEnabled}
                  onClick={() => setHybridModeEnabled(!hybridModeEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    hybridModeEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition duration-150 ease-in-out ${
                      hybridModeEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer info & Dark Mode Toggle */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === 'landing' ? 'Overview' : 'Workbench'}
          </span>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {darkMode ? <Sun className="h-3.5 w-3.5" aria-hidden="true" /> : <Moon className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>
        </div>
      </aside>
    </>
  );
};
