import { describe, it } from 'node:test';
import assert from 'node:assert';
import { analyzeMessage } from '../src/lib/messageAnalyzer';

describe('messageAnalyzer Tests', () => {
  it('detects psychological urgency and alarmist threats', () => {
    const text = 'FINAL NOTICE: Your account has been suspended due to unauthorized activity. Immediate action required within 24 hours!';
    const result = analyzeMessage(text);
    assert.ok(result.urgencyScore >= 50);
    assert.ok(result.signals.some(s => s.category === 'urgency'));
    assert.strictEqual(result.severity, 'high-risk');
  });

  it('detects credential harvesting coercion and OTP demands', () => {
    const text = 'Security alert: Verify your password and enter your 2FA OTP code immediately to restore access.';
    const result = analyzeMessage(text);
    assert.ok(result.credentialScore >= 35);
    assert.ok(result.signals.some(s => s.category === 'credential'));
    assert.strictEqual(result.severity, 'high-risk');
  });

  it('detects financial extortion and gift card lures', () => {
    const text = 'Urgent: Wire transfer $1,500 via Western Union or buy an Apple Gift Card to settle your overdue invoice.';
    const result = analyzeMessage(text);
    assert.ok(result.financialScore >= 30);
    assert.ok(result.signals.some(s => s.category === 'financial'));
  });

  it('extracts and inspects embedded deceptive URLs', () => {
    const text = 'Your USPS package is held. Pay fee at https://usps-parcel-redelivery.xyz/track';
    const result = analyzeMessage(text);
    assert.strictEqual(result.extractedUrls.length, 1);
    assert.strictEqual(result.urlResults.length, 1);
    assert.ok(result.score >= 25);
    assert.ok(result.signals.some(s => s.title.includes('[Embedded Link]')));
  });

  it('recognizes benign everyday messages as safe', () => {
    const text = 'Hey Alex, are we still meeting for lunch today at 1 PM? Let me know if you want Italian.';
    const result = analyzeMessage(text);
    assert.strictEqual(result.severity, 'safe');
    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.signals.length, 0);
  });
});
