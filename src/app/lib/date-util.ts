import { parseDate } from '@internationalized/date';
import * as GQL from '~/graphql/generated/graphql';

type GQLDateTime = GQL.Scalars['DateTime']['output'];
type GQLDate = GQL.Scalars['Date']['output'];

/**
 * Given a DateTime string, return a date time local string
 *
 * @param input ISOString (i.e. 2024-05-13T15:58:12.957Z)
 * @returns date/time string (i.e. 5/13/24, 1:58:12 PM)
 */
export function toLocalDateTime(input: GQLDateTime) {
  const date = new Date(input);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date);
}

/**
 * Does the Date object contain a valid date?
 * Date object can contain 'invalid date' if the input to new Date() is not
 * valid.
 *
 * @param date Date object to check
 * @returns true if Date object contains a valid date
 */
export function isValidDate(date: Date | undefined | null): date is Date {
  return !!date && date instanceof Date && !isNaN(date.getTime());
}

/**
 * Extract the YYYY-MM-DD portion of the input string
 * supports DateTime and Date (in prisma context) string
 * ignores the time portion of the input (skips
 * processing time string)
 *
 * @param input any date string supported by javascript Date object
 * @returns CalendarDate object (useful for DatePicker)
 */
export function parseAsDate(input: GQLDate | null | undefined) {
  if (input == null) {
    return null;
  }

  try {
    const dateObj = parseDate(input.slice(0, 10));
    return dateObj;
  } catch (err) {
    return null;
  }
}
