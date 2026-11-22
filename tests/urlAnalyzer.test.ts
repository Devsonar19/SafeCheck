import { describe, it } from 'node:test';
import assert from 'node:assert';
import { analyzeUrl, calculateEntropy, levenshteinDistance } from '../src/lib/urlAnalyzer';

describe('urlAnalyzer Tests', () => {
  it('detects Cyrillic Unicode homograph attacks', () => {
    // Cyrillic 'ѕ' (U+0455) instead of Latin 's'
    const result = analyzeUrl('https://ѕpotify.com/login');
    assert.strictEqual(result.isHomograph, true);
    assert.strictEqual(result.severity, 'high-risk');
    assert.ok(result.score >= 50);
    assert.ok(result.signals.some(s => s.category === 'homograph'));
  });

  it('detects direct numeric IP hosts', () => {
    const result = analyzeUrl('http://192.168.1.100/admin');
    assert.strictEqual(result.isIpHost, true);
    assert.strictEqual(result.severity, 'high-risk');
    assert.ok(result.signals.some(s => s.category === 'structure' && s.id === 'raw_ip_host'));
  });

  it('detects deceptive userinfo authentication lures (@)', () => {
    const result = analyzeUrl('https://paypal.com@attacker-controlled-site.com/auth');
    assert.strictEqual(result.hasUserInfo, true);
    assert.strictEqual(result.severity, 'high-risk');
    assert.ok(result.signals.some(s => s.id === 'userinfo_lure'));
  });

  it('detects typosquatting against high-value target brands', () => {
    const result = analyzeUrl('https://paypa1-security.com');
    assert.strictEqual(result.isTyposquat, true);
    assert.strictEqual(result.targetBrand, 'paypal');
    assert.strictEqual(result.severity, 'high-risk');
  });

  it('detects high-abuse / free top-level domains', () => {
    const result = analyzeUrl('https://security-verify.top/session');
    assert.strictEqual(result.hasSuspiciousTld, true);
    assert.ok(result.signals.some(s => s.category === 'tld'));
  });

  it('detects open redirect parameters', () => {
    const result = analyzeUrl('https://legit-site.com/login?redirect=https://evil-phish.com');
    assert.ok(result.signals.some(s => s.id === 'open_redirect_param'));
  });

  it('flags insecure HTTP connections', () => {
    const result = analyzeUrl('http://insecure-bank-login.com');
    assert.ok(result.signals.some(s => s.id === 'insecure_http'));
  });

  it('evaluates authentic verified domains as safe', () => {
    const result = analyzeUrl('https://github.com/Devsonar19/SafeCheck');
    assert.strictEqual(result.isHomograph, false);
    assert.strictEqual(result.isIpHost, false);
    assert.strictEqual(result.isTyposquat, false);
    assert.strictEqual(result.severity, 'safe');
    assert.ok(result.score < 25);
  });

  it('calculates Shannon entropy correctly', () => {
    const lowEntropy = calculateEntropy('aaaaabbbbb');
    const highEntropy = calculateEntropy('x89q2m1k0p4z');
    assert.ok(highEntropy > lowEntropy);
  });

  it('computes Levenshtein distance accurately', () => {
    assert.strictEqual(levenshteinDistance('paypal', 'paypal'), 0);
    assert.strictEqual(levenshteinDistance('paypal', 'paypa1'), 1);
    assert.strictEqual(levenshteinDistance('google', 'g00gle'), 2);
  });
});
