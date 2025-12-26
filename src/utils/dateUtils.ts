import { DateTime } from 'luxon';

/**
 * Returns the next birthday DateTime for a given date of birth and timezone, at the specified hour (default 9 AM).
 * @param dateOfBirth ISO string (YYYY-MM-DD)
 * @param timezone IANA timezone string
 * @param hour Hour of the day (default: 9)
 */
export function getNextWishes(dateOfBirth: string, timezone: string, hour: number = 9) {
  const now = DateTime.now().setZone(timezone);
  const wishDate = DateTime.fromISO(dateOfBirth, { zone: timezone });
  let nextWish = wishDate.set({ year: now.year, hour, minute: 0, second: 0, millisecond: 0 });
  if (now > nextWish) {
    nextWish = nextWish.plus({ years: 1 });
  }
  return nextWish;
}

/**
 * Returns the next DateTime at 9 AM in the specified timezone.
 * @param timezone IANA timezone string
 */
export function getNext9am(timezone: string) {
  const now = DateTime.now().setZone(timezone);
  let next9am = now.set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  if (now >= next9am) {
    next9am = next9am.plus({ days: 1 });
  }
  return next9am;
}
