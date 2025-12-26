import { IsValidTimezoneConstraint } from './TimezoneValidator.js';
import { describe, it, expect } from 'vitest';

// Valid IANA timezones
const validTimezones = [
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Jakarta',
  'Australia/Sydney',
];

// Invalid timezones
const invalidTimezones = ['', 'Not/AZone', 'GMT+7', 'America/NotARealCity', '12345'];

describe('IsValidTimezoneConstraint', () => {
  const validator = new IsValidTimezoneConstraint();

  it('should validate correct IANA timezones', () => {
    for (const tz of validTimezones) {
      expect(validator.validate(tz)).toBe(true);
    }
  });

  it('should invalidate incorrect timezones', () => {
    for (const tz of invalidTimezones) {
      expect(validator.validate(tz)).toBe(false);
    }
  });

  it('should return the correct default message', () => {
    expect(validator.defaultMessage()).toMatch(/Invalid timezone/);
  });
});
