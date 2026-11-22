import React, { useState } from 'react';
import {
  History,
  Search,
  Download,
  Trash2,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { OverallThreatVerdict, ThreatSeverity } from '../lib/types';
import { exportHistoryAsJson, exportHistoryAsText } from '../lib/storage';

interface ScanHistoryProps {
  history: OverallThreatVerdict[];
  onSelectVerdict: (verdict: OverallThreatVerdict) => void;
  onClearHistory: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  history,
  onSelectVerdict,
  onClearHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | ThreatSeverity>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredHistory = history.filter(item => {
    const matchesFilter = filterSeverity === 'all' || item.severity === filterSeverity;
    const matchesSearch =
      item.redactedInput.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.signals.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getBadge = (sev: ThreatSeverity) => {
    switch (sev) {
      case 'high-risk':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800 dark:bg-red-950 dark:text-red-300">
            <ShieldAlert className="h-3 w-3" />
            High Risk
          </span>
        );
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <AlertTriangle className="h-3 w-3" />
            Caution
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-3 w-3" />
            Safe
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-2">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
              <History className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Local Scan History Ledger
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Stored strictly inside your browser&apos;s localStorage. Never uploaded to third-party databases.
              </p>
            </div>
          </div>
        </div>

        {/* Export and Clear Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => exportHistoryAsJson(history)}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => exportHistoryAsText(history)}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Export TXT</span>
          </button>

          {!confirmClear ? (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={history.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear History</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setConfirmClear(false);
                }}
                className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="rounded-xl border border-slate-300 px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inspected URLs or text..."
            className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Severity Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'high-risk', 'caution', 'safe'] as const).map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`flex-1 sm:flex-none rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                filterSeverity === sev
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {sev === 'all' ? 'All Scans' : sev === 'high-risk' ? 'High Risk' : sev === 'caution' ? 'Caution' : 'Safe'}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <History className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <h3 className="mt-3 text-sm font-bold text-slate-700 dark:text-slate-300">
            No Scan Records Found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {history.length === 0 ? 'Run your first inspection to start recording local history.' : 'No scans match your current filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map(item => (
            <div
              key={item.id}
              onClick={() => onSelectVerdict(item)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-xs cursor-pointer dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="shrink-0 mt-0.5">
                  {getBadge(item.severity)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {item.redactedInput.slice(0, 80)}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {item.inputType}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:pl-4 sm:border-l border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <span className="tabular-nums font-mono font-bold text-slate-700 dark:text-slate-300">
                  Score: {item.score}/100
                </span>
                <span className="text-[11px]">
                  {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
