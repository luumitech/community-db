import { type DateValue } from '@heroui/react';
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  parseDate,
  parseTime,
  toCalendarDateTime,
  toZoned,
} from '@internationalized/date';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import * as GQL from '~/graphql/generated/graphql';

type GQLDateTime = GQL.Scalars['DateTime']['output'];
type GQLDate = GQL.Scalars['Date']['output'];

/**
 * Given a DateTime string, return a date time local string
 *
 * @param input ISOString (i.e. 2024-05-13T15:58:12.957Z)
 * @returns Date/time string (i.e. 5/13/24, 1:58:12 PM)
 */
export function toLocalDateTime(input: GQLDateTime) {
  const date = new Date(input);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}

/**
 * Does the Date object contain a valid date? Date object can contain 'invalid
 * date' if the input to new Date() is not valid.
 *
 * @param date Date object to check
 * @returns True if Date object contains a valid date
 */
export function isValidDate(
  date: string | Date | undefined | null
): date is Date {
  if (typeof date === 'string') {
    return false;
  }
  return !!date && date instanceof Date && !isNaN(date.getTime());
}

/**
 * Extract the yyyy-MM-dd portion of the input string, and turn it into a
 * ZonedDateTime object.
 *
 * Supports DateTime and Date (in prisma context) string, ignores the time
 * portion of the input (skips processing time string)
 *
 * @param input Any date string supported by javascript Date object
 * @returns ZonedDateTime object (useful for DatePicker)
 */
export function parseAsDate(input: GQLDate | DateValue | null | undefined) {
  if (input == null) {
    return null;
  }
  const midnight = parseTime('00:00');

  if (
    input instanceof CalendarDate ||
    input instanceof CalendarDateTime ||
    input instanceof ZonedDateTime
  ) {
    // Probably one of the supported DateValue object (i.e. CalendarDate)
    return toZoned(toCalendarDateTime(input, midnight), 'UTC');
  }

  try {
    // Keep the YYYY-MM-DD portion of the string
    const dateObj = parseDate(input.slice(0, 10));
    return toZoned(toCalendarDateTime(dateObj, midnight), 'UTC');
  } catch (err) {
    return null;
  }
}

/**
 * Get the current year (i.e. 2024)
 *
 * @returns
 */
export function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Get the current date (i.e. Jan 20, 2024)
 *
 * @returns
 */
export function getCurrentDate() {
  return format(new Date(), 'MMM d, yyyy');
}

/**
 * Get the current date in ISOString form (i.e. 2024-01-20T00:00:00.000Z)
 *
 * @returns
 */
export function getCurrentDateAsISOString() {
  const zonedToday = parseAsDate(new Date().toISOString());
  if (!zonedToday) {
    throw new Error("Unable to parse today's date");
  }
  return zonedToday.toAbsoluteString();
}

/**
 * Format local date as yyyy-MM-dd
 *
 * ```js
 * expect(formatLocalDate(new Date(2000, 0, 1)).toBe("2000-01-01")
 * // If you are in EST, you will be behind UTC time line
 * expect(formatLocalDate('2000-01-01T00:00:00.000Z').toBe("1999-12-31")
 * ```
 *
 * @param input Input Date. Interprets dates in local time zone
 * @param dateFmt Optional date format, default to 'yyyy-MM-dd'
 * @returns Date in string format
 */
export function formatLocalDate(
  input: string | number | Date,
  dateFmt?: string
) {
  return format(input, dateFmt ?? 'yyyy-MM-dd');
}

/**
 * Format UTC date as yyyy-MM-dd
 *
 * ```js
 * expect(formatUTCDate('2000-01-01T00:00:00.000Z').toBe("2000-01-01")
 * ```
 *
 * @param input Input Date. Interprets dates in UTC time zone
 * @param dateFmt Optional date format, default to 'yyyy-MM-dd'
 * @returns Date in string format
 */
export function formatUTCDate(input: string | number | Date, dateFmt?: string) {
  return formatInTimeZone(input, 'UTC', dateFmt ?? 'yyyy-MM-dd');
}

/**
 * Promisified timeout function
 *
 * @param ms Second to wait (in ms)
 * @returns
 */
export async function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
