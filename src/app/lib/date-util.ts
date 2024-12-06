import { parseDate, toCalendarDate } from '@internationalized/date';
import { type DateValue } from '@nextui-org/react';
import { format } from 'date-fns';
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
export function isValidDate(date: Date | undefined | null): date is Date {
  return !!date && date instanceof Date && !isNaN(date.getTime());
}

/**
 * Extract the yyyy-MM-dd portion of the input string supports DateTime and Date
 * (in prisma context) string ignores the time portion of the input (skips
 * processing time string)
 *
 * @param input Any date string supported by javascript Date object
 * @returns CalendarDate object (useful for DatePicker)
 */
export function parseAsDate(input: GQLDate | DateValue | null | undefined) {
  if (input == null) {
    return null;
  }

  if (typeof input === 'object') {
    // Probably one of the supported DateValue object (i.e. CalendarDate)
    return toCalendarDate(input);
  }

  try {
    const dateObj = parseDate(input.slice(0, 10));
    return dateObj;
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
 * Format date as yyyy-MM-dd
 *
 * ```js
 * expect(formatAsDate(new Date(2000, 0, 1)).toBe("2000-01-01")
 * ```
 *
 * @param input Input Date
 * @returns Date string in "yyyy-MM-dd" format
 */
export function formatAsDate(input: Date) {
  return format(input, 'yyyy-MM-dd');
}
