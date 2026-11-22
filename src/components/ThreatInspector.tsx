import React, { useState, useRef } from 'react';
import {
  Link,
  MessageSquare,
  Image as ImageIcon,
  Shield,
  Upload,
  RefreshCw,
  Sparkles,
  Lock,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { OverallThreatVerdict } from '../lib/types';
import { evaluateThreat } from '../lib/threatEngine';

interface ThreatInspectorProps {
  onVerdictGenerated: (verdict: OverallThreatVerdict) => void;
  piiRedactionEnabled: boolean;
  setPiiRedactionEnabled: (val: boolean) => void;
  hybridModeEnabled: boolean;
  setHybridModeEnabled: (val: boolean) => void;
  initialType?: 'url' | 'message';
  initialContent?: string;
}

export const ThreatInspector: React.FC<ThreatInspectorProps> = ({
  onVerdictGenerated,
  piiRedactionEnabled,
  setPiiRedactionEnabled,
  hybridModeEnabled,
  setHybridModeEnabled,
  initialType = 'url',
  initialContent = '',
}) => {
  const [activeInputType, setActiveInputType] = useState<'url' | 'message' | 'screenshot'>(initialType);
  const [urlInput, setUrlInput] = useState(initialType === 'url' ? initialContent : '');
  const [messageInput, setMessageInput] = useState(initialType === 'message' ? initialContent : '');
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleUrls = [
    { label: 'Cyrillic Homograph', val: 'https://ѕpotify.com/login-verify' },
    { label: 'Brand Typosquat', val: 'https://paypa1-security.top/account' },
    { label: 'Userinfo Trap (@)', val: 'https://paypal.com@attacker-portal.net/verify' },
    { label: 'Official GitHub (Safe)', val: 'https://github.com/Devsonar19/SafeCheck' },
  ];

  const sampleMessages = [
    {
      label: 'USPS Smishing Lure',
      val: 'USPS Urgent Notice: Your package US-892410 is on hold due to missing address. Pay $1.85 redelivery within 12 hours: https://usps-post-redelivery.top/step1',
    },
    {
      label: 'Account Suspension Lure',
      val: 'FINAL NOTICE: Your bank account will be suspended within 24 hours due to unauthorized activity. Verify password and enter your OTP token to avoid account closure.',
    },
    {
      label: 'Everyday Message (Safe)',
      val: 'Hey Sarah, here are the project notes for our design review tomorrow morning. Looking forward to your thoughts!',
    },
  ];

  const handleRunScan = async () => {
    setErrorMessage(null);
    let targetContent = '';

    if (activeInputType === 'url') {
      targetContent = urlInput.trim();
      if (!targetContent) {
        setErrorMessage('Please enter a URL to inspect.');
        return;
      }
    } else if (activeInputType === 'message') {
      targetContent = messageInput.trim();
      if (!targetContent) {
        setErrorMessage('Please paste or type the message content to inspect.');
        return;
      }
    } else {
      if (!screenshotData) {
        setErrorMessage('Please select or upload a screenshot to inspect.');
        return;
      }
      targetContent = screenshotName || 'uploaded-screenshot.png';
    }

    setIsAnalyzing(true);

    try {
      // 1. Instant deterministic evaluation (< 5ms)
      const localVerdict = evaluateThreat({
        inputType: activeInputType,
        content: targetContent,
        piiRedactionEnabled,
        hybridModeEnabled,
        fileName: screenshotName || undefined,
      });

      // 2. If Hybrid Mode is enabled and online, call server AI proxy
      if (hybridModeEnabled) {
        try {
          const res = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inputType: activeInputType,
              content: localVerdict.redactedInput,
              piiRedacted: piiRedactionEnabled,
              base64Image: activeInputType === 'screenshot' ? screenshotData : undefined,
            }),
          });

          if (res.ok) {
            const aiData = await res.json();
            if (aiData.aiInsight) {
              localVerdict.aiInsight = aiData.aiInsight;
              if (aiData.aiScore > 0) {
                // Fuse deterministic and AI confidence
                localVerdict.score = Math.max(localVerdict.score, aiData.aiScore);
                if (localVerdict.score >= 55) {
                  localVerdict.severity = 'high-risk';
                }
              }
            }
          }
        } catch {
          // Graceful fallback to deterministic local results
          localVerdict.aiInsight = 'Hybrid AI analysis proxy offline; local deterministic inspection completed successfully.';
        }
      }

      onVerdictGenerated(localVerdict);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('File size exceeds safe limit (4 MB).');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Input Type Selector Tabs */}
      <div className="flex rounded-2xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => {
            setActiveInputType('url');
            setErrorMessage(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-blue-600 ${
            activeInputType === 'url'
              ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-800 dark:text-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Link className="h-4 w-4" aria-hidden="true" />
          <span>Inspect Link</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveInputType('message');
            setErrorMessage(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-blue-600 ${
            activeInputType === 'message'
              ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-800 dark:text-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          <span>Analyze Message</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveInputType('screenshot');
            setErrorMessage(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-blue-600 ${
            activeInputType === 'screenshot'
              ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-800 dark:text-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
          <span>Audit Screenshot</span>
        </button>
      </div>

      {/* Input Panel Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
        {/* URL Form */}
        {activeInputType === 'url' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="url-input-field" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Untrusted Target URL
              </label>
              <span className="text-xs text-slate-400">Pure string parsing — zero outbound execution</span>
            </div>
            <div className="relative">
              <input
                id="url-input-field"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. https://ѕpotify.com/login or paypa1-verify.xyz"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-blue-500"
              />
            </div>

            {/* Quick Samples */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Samples:</span>
              {sampleUrls.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrlInput(s.val)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Form */}
        {activeInputType === 'message' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="message-input-field" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Suspicious SMS / Email Text
              </label>
              <span className="text-xs text-slate-400">{messageInput.length} characters</span>
            </div>
            <textarea
              id="message-input-field"
              rows={4}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Paste email or SMS copy here. SafeCheck will auto-detect urgency, credential demands, and embedded links..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-blue-500"
            />

            {/* Quick Samples */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-semibold text-slate-400">Samples:</span>
              {sampleMessages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageInput(s.val)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screenshot Upload Form */}
        {activeInputType === 'screenshot' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Upload Deceptive Screenshot (Max 4 MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
              className="sr-only"
              id="screenshot-file-input"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition-colors hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-slate-800/40"
            >
              {screenshotData ? (
                <div className="space-y-2">
                  <img
                    src={screenshotData}
                    alt="Uploaded candidate for inspection"
                    className="max-h-48 rounded-lg shadow-xs mx-auto"
                  />
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {screenshotName} (Click to replace)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Upload className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Upload an image
                    </span>
                    <span className="text-sm text-slate-500"> or drag and drop</span>
                  </div>
                  <p className="text-xs text-slate-400">PNG, JPG, or WebP up to 4MB</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons & Quick Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              Privacy Shield: {piiRedactionEnabled ? 'ON' : 'OFF'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-purple-500" aria-hidden="true" />
              {hybridModeEnabled ? 'Hybrid AI' : 'Local-Only'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRunScan}
            disabled={isAnalyzing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs transition-all hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Dissecting Payload...</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Run Defensive Inspection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
