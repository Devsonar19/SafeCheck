import { describe, it } from 'node:test';
import assert from 'node:assert';
import { evaluateThreat, generateRecommendations } from '../src/lib/threatEngine';

describe('threatEngine Tests', () => {
  it('correctly bounds score between 0 and 100', () => {
    const verdict = evaluateThreat({
      inputType: 'url',
      content: 'https://paypa1-security.top/login',
      piiRedactionEnabled: true,
      hybridModeEnabled: false,
    });

    assert.ok(verdict.score >= 0 && verdict.score <= 100);
    assert.strictEqual(verdict.severity, 'high-risk');
    assert.ok(verdict.signals.length > 0);
  });

  it('redacts PII when privacy shield is enabled', () => {
    const verdict = evaluateThreat({
      inputType: 'message',
      content: 'Send your password to admin@fake-corp.xyz or call 800-555-0199',
      piiRedactionEnabled: true,
      hybridModeEnabled: false,
    });

    assert.strictEqual(verdict.piiMasked, true);
    assert.ok(verdict.redactedInput.includes('[REDACTED_EMAIL]'));
    assert.ok(verdict.redactedInput.includes('[REDACTED_PHONE]'));
  });

  it('executes in sub-15ms for deterministic speed', () => {
    const verdict = evaluateThreat({
      inputType: 'url',
      content: 'https://docs.github.com/en/get-started',
      piiRedactionEnabled: true,
      hybridModeEnabled: false,
    });

    assert.ok(verdict.executionTimeMs < 15, `Deterministic analysis took ${verdict.executionTimeMs}ms`);
    assert.strictEqual(verdict.severity, 'safe');
  });

  it('generates concrete defensive recommendations', () => {
    const recs = generateRecommendations('high-risk', [
      { id: '1', category: 'homograph', title: 'Homograph', description: 'desc', severity: 'high-risk' }
    ], 'url');

    assert.ok(recs.length >= 3);
    assert.ok(recs.some(r => r.includes('DO NOT click')));
  });
});
