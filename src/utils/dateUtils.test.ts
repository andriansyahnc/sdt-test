import { getNextWishes } from './dateUtils.js';
import { DateTime, Settings } from 'luxon';
import { describe, it, expect, afterEach } from 'vitest';

describe('getNextWishes', () => {
  const REAL_NOW = Settings.now;
  afterEach(() => {
    Settings.now = REAL_NOW;
  });
  it('returns 9 AM today if today is birthday and before 9 AM', () => {
    const timezone = 'Asia/Tokyo';
    // Freeze time to 2025-12-25 08:00 in Asia/Tokyo
    const frozenNow = DateTime.fromISO('2025-12-25T08:00:00', { zone: timezone });
    Settings.now = () => frozenNow.toMillis();
    const today = frozenNow.toISODate()!;
    const nextBirthday = getNextWishes(today, timezone, 9);
    expect(nextBirthday.setZone(timezone).toFormat('yyyy-MM-dd HH:mm')).toBe(
      frozenNow.set({ hour: 9, minute: 0 }).toFormat('yyyy-MM-dd HH:mm'),
    );
  });

  it('returns 9 AM next year if today is birthday and after 9 AM', () => {
    const timezone = 'Asia/Tokyo';
    // Freeze time to 2025-12-25 10:00 in Asia/Tokyo
    const frozenNow = DateTime.fromISO('2025-12-25T10:00:00', { zone: timezone });
    Settings.now = () => frozenNow.toMillis();
    const today = frozenNow.toISODate()!;
    const nextBirthday = getNextWishes(today, timezone, 9);
    expect(nextBirthday.year).toBe(frozenNow.year + 1);
    expect(nextBirthday.month).toBe(frozenNow.month);
    expect(nextBirthday.day).toBe(frozenNow.day);
    expect(nextBirthday.hour).toBe(9);
  });

  it('returns 9 AM this year if birthday is later this year', () => {
    const dob = '2000-12-31';
    const timezone = 'America/New_York';
    // Freeze time to 2025-12-25 00:00 in America/New_York
    const frozenNow = DateTime.fromISO('2025-12-25T00:00:00', { zone: timezone });
    Settings.now = () => frozenNow.toMillis();
    const nextBirthday = getNextWishes(dob, timezone, 9);
    expect(nextBirthday.year).toBe(frozenNow.year);
    expect(nextBirthday.month).toBe(12);
    expect(nextBirthday.day).toBe(31);
    expect(nextBirthday.hour).toBe(9);
  });

  it('returns 9 AM next year if birthday already passed this year', () => {
    const dob = '2000-01-01';
    const timezone = 'Europe/London';
    // Freeze time to 2025-12-25 00:00 in Europe/London
    const frozenNow = DateTime.fromISO('2025-12-25T00:00:00', { zone: timezone });
    Settings.now = () => frozenNow.toMillis();
    const nextBirthday = getNextWishes(dob, timezone, 9);
    expect(nextBirthday.year).toBe(frozenNow.year + 1);
    expect(nextBirthday.month).toBe(1);
    expect(nextBirthday.day).toBe(1);
    expect(nextBirthday.hour).toBe(9);
  });
});
