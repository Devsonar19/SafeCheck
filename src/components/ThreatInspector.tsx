import React, { useState, useRef } from 'react';
import {
  Link,
  MessageSquare,
  Image as ImageIcon,
  Shield,
  Upload,
  Loader2
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
  hybridModeEnabled,
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
    { label: 'UserInfo Trap (@)', val: 'https://paypal.com@attacker-portal.net/verify' },
    { label: 'Verified GitHub (Safe)', val: 'https://github.com/Devsonar19/SafeCheck' },
  ];

  const sampleMessages = [
    {
      label: 'USPS Smishing Alert',
      val: 'USPS Notice: Your package US-892410 is on hold due to missing street number. Pay $1.85 redelivery fee within 12 hours: https://usps-post-redelivery.top/step1',
    },
    {
      label: 'Urgent Account Freeze',
      val: 'FINAL NOTICE: Your account has been suspended due to unauthorized login. Verify password and enter your OTP token to restore immediate access.',
    },
    {
      label: 'Everyday Message (Safe)',
      val: 'Hey Sarah, here are the meeting notes for our review tomorrow morning. Looking forward to your feedback!',
    },
  ];

  const handleRunScan = async () => {
    setErrorMessage(null);
    let targetContent = '';

    if (activeInputType === 'url') {
      targetContent = urlInput.trim();
      if (!targetContent) {
        setErrorMessage('Enter a URL to inspect.');
        return;
      }
    } else if (activeInputType === 'message') {
      targetContent = messageInput.trim();
      if (!targetContent) {
        setErrorMessage('Paste or type the message content to inspect.');
        return;
      }
    } else {
      if (!screenshotData) {
        setErrorMessage('Upload a screenshot to inspect.');
        return;
      }
      targetContent = screenshotName || 'uploaded-screenshot.png';
    }

    setIsAnalyzing(true);

    try {
      const localVerdict = evaluateThreat({
        inputType: activeInputType,
        content: targetContent,
        piiRedactionEnabled,
        hybridModeEnabled,
        fileName: screenshotName || undefined,
      });

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
                localVerdict.score = Math.max(localVerdict.score, aiData.aiScore);
                if (localVerdict.score >= 55) {
                  localVerdict.severity = 'high-risk';
                }
              }
            }
          }
        } catch {
          localVerdict.aiInsight = 'Local deterministic inspection completed (hybrid offline).';
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
      setErrorMessage('Please select a PNG, JPG, or WebP image.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMessage('File size must be under 4 MB.');
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
      {/* Tab Controls: Inner Radius (rounded-lg = 8px) = Outer (rounded-xl = 12px) - Padding (p-1 = 4px) */}
      <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => {
            setActiveInputType('url');
            setErrorMessage(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors ${
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
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors ${
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
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-colors ${
            activeInputType === 'screenshot'
              ? 'bg-white text-blue-700 shadow-xs dark:bg-slate-800 dark:text-blue-300'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
          <span>Audit Screenshot</span>
        </button>
      </div>

      {/* Main Inspection Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-5">
        {activeInputType === 'url' && (
          <div className="space-y-3">
            <label htmlFor="url-input-field" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Web Address to Inspect
            </label>
            <input
              id="url-input-field"
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://ѕpotify.com/login or paypa1-verify.xyz"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-sm text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100 dark:focus:border-blue-500"
            />

            {/* Quick Samples */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Samples:</span>
              {sampleUrls.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrlInput(s.val)}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeInputType === 'message' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="message-input-field" className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Message Content
              </label>
              <span className="tabular-nums text-[11px] text-slate-500 dark:text-slate-400">
                {messageInput.length} characters
              </span>
            </div>
            <textarea
              id="message-input-field"
              rows={4}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Paste email, SMS, or chat text here..."
              className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3.5 text-sm text-slate-900 transition-colors focus:border-blue-600 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100 dark:focus:border-blue-500"
            />

            {/* Quick Samples */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Samples:</span>
              {sampleMessages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageInput(s.val)}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/40"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeInputType === 'screenshot' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Screenshot Image
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
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-8 text-center transition-colors hover:border-blue-500 hover:bg-slate-50 cursor-pointer dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-slate-850"
            >
              {screenshotData ? (
                <div className="space-y-2">
                  <img
                    src={screenshotData}
                    alt="Uploaded candidate for inspection"
                    className="max-h-44 rounded-lg shadow-xs mx-auto"
                  />
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {screenshotName} (Click to change)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Upload className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      Choose screenshot
                    </span>
                    <span className="text-xs text-slate-500"> or drag file here</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">PNG, JPG, or WebP up to 4 MB</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activeInputType === 'url' ? 'Inert string parsing' : activeInputType === 'message' ? 'Heuristic + PII check' : 'Visual audit'}
          </span>

          <button
            type="button"
            onClick={handleRunScan}
            disabled={isAnalyzing}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 active:bg-blue-800 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Inspecting...</span>
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>Inspect Target</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
