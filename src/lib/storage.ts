import { OverallThreatVerdict } from './types';

const STORAGE_KEY = 'safecheck_scan_history_v1';
const MAX_HISTORY_ITEMS = 50;

/**
 * Validates the schema of an individual scan history item.
 */
function isValidVerdict(item: unknown): item is OverallThreatVerdict {
  if (!item || typeof item !== 'object') return false;
  const v = item as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.timestamp === 'number' &&
    (v.inputType === 'url' || v.inputType === 'message' || v.inputType === 'screenshot') &&
    typeof v.score === 'number' &&
    (v.severity === 'safe' || v.severity === 'caution' || v.severity === 'high-risk') &&
    Array.isArray(v.signals) &&
    Array.isArray(v.recommendedActions)
  );
}

/**
 * Loads scan history from localStorage with strict runtime schema validation.
 */
export function loadScanHistory(): OverallThreatVerdict[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidVerdict);
  } catch (err) {
    console.error('Failed to load scan history from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new verdict into localStorage, keeping only the most recent MAX_HISTORY_ITEMS.
 */
export function saveScanVerdict(verdict: OverallThreatVerdict): OverallThreatVerdict[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [verdict];
  }

  try {
    const existing = loadScanHistory();
    // Prepend new verdict and deduplicate by id
    const filtered = existing.filter(item => item.id !== verdict.id);
    const updated = [verdict, ...filtered].slice(0, MAX_HISTORY_ITEMS);

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save scan verdict to localStorage:', err);
    return [verdict];
  }
}

/**
 * Clears the entire local scan history.
 */
export function clearScanHistory(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear scan history:', err);
  }
}

/**
 * Exports history items as formatted JSON.
 */
export function exportHistoryAsJson(history: OverallThreatVerdict[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `safecheck-scans-${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Exports history items as clean text summary.
 */
export function exportHistoryAsText(history: OverallThreatVerdict[]): void {
  const lines = history.map(h => {
    const date = new Date(h.timestamp).toISOString();
    return `[${date}] ${h.severity.toUpperCase()} (Score: ${h.score}/100) | Type: ${h.inputType}\nTarget: ${h.redactedInput.slice(0, 100)}\nSummary: ${h.summary}\nSignals: ${h.signals.map(s => s.title).join('; ') || 'None'}\n---`;
  });
  const dataStr = 'data:text/plain;charset=utf-8,' + encodeURIComponent(lines.join('\n\n'));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `safecheck-scans-${Date.now()}.txt`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
