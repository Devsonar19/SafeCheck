import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { AnimatedLanding } from './components/AnimatedLanding';
import { ThreatInspector } from './components/ThreatInspector';
import { VerdictPanel } from './components/VerdictPanel';
import { ScamDrills } from './components/ScamDrills';
import { SafetyGuide } from './components/SafetyGuide';
import { ScanHistory } from './components/ScanHistory';
import { OverallThreatVerdict } from './lib/types';
import { loadScanHistory, saveScanVerdict, clearScanHistory } from './lib/storage';
import { Menu, ArrowLeft } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [currentVerdict, setCurrentVerdict] = useState<OverallThreatVerdict | null>(null);
  const [history, setHistory] = useState<OverallThreatVerdict[]>([]);
  const [piiRedactionEnabled, setPiiRedactionEnabled] = useState(true);
  const [hybridModeEnabled, setHybridModeEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initial loader parameters for quick sample clicks
  const [prefilledType, setPrefilledType] = useState<'url' | 'message'>('url');
  const [prefilledContent, setPrefilledContent] = useState('');

  // Load history from localStorage on initial mount
  useEffect(() => {
    const saved = loadScanHistory();
    setHistory(saved);
  }, []);

  // Sync dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleVerdictGenerated = (verdict: OverallThreatVerdict) => {
    setCurrentVerdict(verdict);
    const updated = saveScanVerdict(verdict);
    setHistory(updated);
  };

  const handleNewScan = () => {
    setCurrentVerdict(null);
    setPrefilledContent('');
    setActiveTab('scanner');
  };

  const handleLoadSample = (type: 'url' | 'message', sampleText: string) => {
    setPrefilledType(type);
    setPrefilledContent(sampleText);
    setCurrentVerdict(null);
    setActiveTab('scanner');
  };

  const handleSelectHistoryVerdict = (verdict: OverallThreatVerdict) => {
    setCurrentVerdict(verdict);
    setActiveTab('scanner');
  };

  const handleClearHistory = () => {
    clearScanHistory();
    setHistory([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
      {/* WCAG AAA Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2.5 focus:font-bold focus:text-white focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Sidebar Rail */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'scanner') {
            setCurrentVerdict(null);
          }
        }}
        onNewScan={handleNewScan}
        historyCount={history.length}
        piiRedactionEnabled={piiRedactionEnabled}
        setPiiRedactionEnabled={setPiiRedactionEnabled}
        hybridModeEnabled={hybridModeEnabled}
        setHybridModeEnabled={setHybridModeEnabled}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main App Workspace */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            SafeCheck Defense
          </span>
          <div className="w-5" />
        </header>

        {/* Dynamic Workspace Container */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 outline-hidden"
        >
          {activeTab === 'landing' && (
            <AnimatedLanding
              onStartScan={() => {
                setActiveTab('scanner');
                setCurrentVerdict(null);
              }}
              onLoadSample={handleLoadSample}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'scanner' && (
            <div className="mx-auto max-w-5xl space-y-8">
              {/* Back to Home / Reset */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Threat Inspector Workbench
                  </h1>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Dissect URLs, SMS/email messages, or deceptive screenshots with zero untrusted execution.
                  </p>
                </div>

                {currentVerdict && (
                  <button
                    type="button"
                    onClick={handleNewScan}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Scan Another Target</span>
                  </button>
                )}
              </div>

              {/* Input or Verdict View */}
              {!currentVerdict ? (
                <ThreatInspector
                  key={`${prefilledType}-${prefilledContent}`}
                  onVerdictGenerated={handleVerdictGenerated}
                  piiRedactionEnabled={piiRedactionEnabled}
                  setPiiRedactionEnabled={setPiiRedactionEnabled}
                  hybridModeEnabled={hybridModeEnabled}
                  setHybridModeEnabled={setHybridModeEnabled}
                  initialType={prefilledType}
                  initialContent={prefilledContent}
                />
              ) : (
                <VerdictPanel verdict={currentVerdict} />
              )}
            </div>
          )}

          {activeTab === 'drills' && <ScamDrills />}

          {activeTab === 'guide' && <SafetyGuide />}

          {activeTab === 'history' && (
            <ScanHistory
              history={history}
              onSelectVerdict={handleSelectHistoryVerdict}
              onClearHistory={handleClearHistory}
            />
          )}
        </main>
      </div>
    </div>
  );
}
