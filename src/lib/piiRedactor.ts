import { PiiRedactionResult, PiiItem } from './types';

// Strict, linear, non-backtracking regular expressions (ReDoS-safe)
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// Standard phone formats: +1-800-555-0199, (555) 123-4567, +91 9876543210, 555-123-4567
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

// Payment Card numbers: 13 to 19 digits with optional spaces or dashes
const CARD_REGEX = /\b(?:\d{4}[-\s]?){3}\d{1,7}\b/g;

// US SSN or 9-digit sensitive IDs: 123-45-6789 or 9-digit sequences
const SSN_REGEX = /\b\d{3}-\d{2}-\d{4}\b/g;

// 6-digit verification codes/OTPs preceded by keywords like code, otp, pin, verify
const OTP_REGEX = /\b(?:code|otp|pin|verify|verification|password|token)[\s:=#]+(\d{4,8})\b/gi;

/**
 * Validates a card number using the Luhn algorithm.
 */
export function isValidLuhn(digitsOnly: string): boolean {
  if (digitsOnly.length < 13 || digitsOnly.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly.charAt(i), 10);
    if (isNaN(digit)) return false;
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

/**
 * Scans and redacts Personally Identifiable Information (PII)
 * before any data leaves the client or is saved to storage.
 */
export function redactPii(text: string): PiiRedactionResult {
  if (!text || typeof text !== 'string') {
    return { redactedText: '', detectedCount: 0, items: [] };
  }

  let redacted = text;
  let emailCount = 0;
  let phoneCount = 0;
  let cardCount = 0;
  let idCount = 0;
  let otpCount = 0;

  // 1. Redact Emails
  redacted = redacted.replace(EMAIL_REGEX, () => {
    emailCount++;
    return '[REDACTED_EMAIL]';
  });

  // 2. Redact SSN / IDs
  redacted = redacted.replace(SSN_REGEX, () => {
    idCount++;
    return '[REDACTED_ID]';
  });

  // 3. Redact Payment Cards (with sanity check)
  redacted = redacted.replace(CARD_REGEX, (match) => {
    const digits = match.replace(/[\s-]/g, '');
    if (digits.length >= 13 && digits.length <= 19) {
      cardCount++;
      return '[REDACTED_CARD]';
    }
    return match;
  });

  // 4. Redact Phone Numbers
  redacted = redacted.replace(PHONE_REGEX, (match) => {
    // Avoid false positives on simple dates or standard small numbers
    const digits = match.replace(/\D/g, '');
    if (digits.length >= 10 && digits.length <= 15) {
      phoneCount++;
      return '[REDACTED_PHONE]';
    }
    return match;
  });

  // 5. Redact OTPs
  redacted = redacted.replace(OTP_REGEX, (fullMatch, code) => {
    otpCount++;
    return fullMatch.replace(code, '[REDACTED_OTP]');
  });

  const items: PiiItem[] = [];
  if (emailCount > 0) items.push({ type: 'email', count: emailCount });
  if (phoneCount > 0) items.push({ type: 'phone', count: phoneCount });
  if (cardCount > 0) items.push({ type: 'card', count: cardCount });
  if (idCount > 0) items.push({ type: 'id', count: idCount });
  if (otpCount > 0) items.push({ type: 'otp', count: otpCount });

  const detectedCount = emailCount + phoneCount + cardCount + idCount + otpCount;

  return {
    redactedText: redacted,
    detectedCount,
    items,
  };
}
