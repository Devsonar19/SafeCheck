import { describe, it } from 'node:test';
import assert from 'node:assert';
import { redactPii, isValidLuhn } from '../src/lib/piiRedactor';

describe('piiRedactor Tests', () => {
  it('redacts email addresses correctly', () => {
    const input = 'Contact user john.doe@secure-corp.org for account assistance.';
    const result = redactPii(input);
    assert.strictEqual(result.redactedText, 'Contact user [REDACTED_EMAIL] for account assistance.');
    assert.strictEqual(result.detectedCount, 1);
    assert.ok(result.items.some(i => i.type === 'email'));
  });

  it('redacts international and standard phone numbers', () => {
    const input = 'Call our fraud department at +1-800-555-0199 or 555-123-4567 immediately.';
    const result = redactPii(input);
    assert.ok(result.redactedText.includes('[REDACTED_PHONE]'));
    assert.ok(result.detectedCount >= 1);
  });

  it('redacts credit card numbers', () => {
    const input = 'Charged to card 4532-1234-5678-9012 for validation.';
    const result = redactPii(input);
    assert.ok(result.redactedText.includes('[REDACTED_CARD]'));
    assert.ok(result.items.some(i => i.type === 'card'));
  });

  it('redacts SSN / national IDs', () => {
    const input = 'Social security number on file: 123-45-6789.';
    const result = redactPii(input);
    assert.strictEqual(result.redactedText, 'Social security number on file: [REDACTED_ID].');
  });

  it('redacts OTP verification tokens', () => {
    const input = 'Your login code: 829401. Do not share.';
    const result = redactPii(input);
    assert.ok(result.redactedText.includes('[REDACTED_OTP]'));
  });

  it('executes in linear time against adversarial input (ReDoS immunity)', () => {
    // 10,000 repeating characters designed to trigger catastrophic backtracking in flawed regexes
    const evilPayload = 'a'.repeat(10000) + '@' + 'b'.repeat(10000);
    const start = performance.now();
    const result = redactPii(evilPayload);
    const elapsed = performance.now() - start;

    assert.ok(elapsed < 100, `Execution took ${elapsed}ms, exceeding linear ReDoS budget`);
    assert.strictEqual(typeof result.redactedText, 'string');
  });

  it('validates Luhn algorithm accurately', () => {
    // Valid test Visa card number format
    assert.strictEqual(isValidLuhn('4532015112830366'), true);
    // Invalid card number
    assert.strictEqual(isValidLuhn('4532015112830367'), false);
  });
});
