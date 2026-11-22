import React from 'react';
import {
  ShieldAlert,
  Target,
  BookOpenCheck,
  History,
  PlusCircle,
  Sun,
  Moon,
  ShieldCheck,
  Sliders,
  Cpu,
  Lock,
  Menu,
  X
} from 'lucide-react';

export type ActiveTab = 'landing' | 'scanner' | 'drills' | 'guide' | 'history';

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
      badge: 'Zero-Click',
      description: 'Dissect links, text & screenshots'
    },
    {
      id: 'drills' as ActiveTab,
      label: 'Scam Drills',
      icon: Target,
      badge: '4 Levels',
      description: 'Interactive awareness trainer'
    },
    {
      id: 'guide' as ActiveTab,
      label: 'Safety Guide',
      icon: BookOpenCheck,
      badge: 'Triage',
      description: 'Emergency protocols & checklists'
    },
    {
      id: 'history' as ActiveTab,
      label: 'Scan History',
      icon: History,
      badge: historyCount > 0 ? `${historyCount}` : undefined,
      description: 'Private in-browser ledger'
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Rail */}
      <aside
        id="main-sidebar"
        aria-label="Application Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveTab('landing');
              setMobileOpen(false);
            }}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md p-1"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                SafeCheck
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Defense Shield
              </span>
            </div>
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* TOP ACTION: Prominent "New Scan" Button */}
        <div className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => {
              onNewScan();
              setActiveTab('scanner');
              setMobileOpen(false);
            }}
            className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-90 duration-200" aria-hidden="true" />
            <span>New Threat Scan</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Main Navigation" className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspaces
          </p>
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
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200'
                    }`}
                    aria-hidden="true"
                  />
                  <div>
                    <span className="block leading-snug">{item.label}</span>
                    <span className="block text-[11px] font-normal text-slate-400 dark:text-slate-500">
                      {item.description}
                    </span>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* ENGINE CONTROLS / ACCESSIBLE TOGGLES */}
          <div className="pt-4">
            <p className="flex items-center gap-1.5 px-3 pt-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <Sliders className="h-3 w-3" aria-hidden="true" />
              Engine Shield Controls
            </p>

            <div className="space-y-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
              {/* PII Redaction Toggle */}
              <div className="flex items-center justify-between">
                <div className="pr-2">
                  <label htmlFor="pii-toggle" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    PII Privacy Shield
                  </label>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    Auto-mask emails, cards & OTPs
                  </span>
                </div>
                <button
                  id="pii-toggle"
                  type="button"
                  role="switch"
                  aria-checked={piiRedactionEnabled}
                  onClick={() => setPiiRedactionEnabled(!piiRedactionEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                    piiRedactionEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      piiRedactionEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Hybrid AI Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="pr-2">
                  <label htmlFor="hybrid-toggle" className="block text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                    Hybrid Deep AI
                  </label>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                    {hybridModeEnabled ? 'Gemini 2.5 Flash active' : 'Local-only heuristics (<5ms)'}
                  </span>
                </div>
                <button
                  id="hybrid-toggle"
                  type="button"
                  role="switch"
                  aria-checked={hybridModeEnabled}
                  onClick={() => setHybridModeEnabled(!hybridModeEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                    hybridModeEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      hybridModeEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer info & Dark Mode Toggle */}
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Zero-Execution Active
              </span>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {darkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
