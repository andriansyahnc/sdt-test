
import { DateTime } from 'luxon';

/**
 * Returns the next birthday DateTime for a given date of birth and timezone, at the specified hour (default 9 AM).
 * @param dateOfBirth ISO string (YYYY-MM-DD)
 * @param timezone IANA timezone string
 * @param hour Hour of the day (default: 9)
 */
export function getNextBirthday(dateOfBirth: string, timezone: string, hour: number = 9) {
  const now = DateTime.now().setZone(timezone);
  const birthDate = DateTime.fromISO(dateOfBirth, { zone: timezone });
  let nextBirthday = birthDate.set({ year: now.year, hour, minute: 0, second: 0, millisecond: 0 });
  if (now > nextBirthday) {
    nextBirthday = nextBirthday.plus({ years: 1 });
  }
  return nextBirthday;
}
