import { CalendarDate } from '@internationalized/date';
import { isValidDate } from '~/lib/date-util';
import type { PropertyEntry } from './_type';

export type Property = Pick<PropertyEntry, 'membershipList'>;

/**
 * Extract the Month/Day from UTC date and create a CalendarDate object on year
 * 2000. So we can compare two date object by distance to Jan 1, 2000
 */
function toCalendarDate(input: string | Date | null | undefined) {
  if (!isValidDate(input)) {
    return new CalendarDate(2001, 1, 1);
  }
  const calDate = new CalendarDate(
    2000,
    input.getUTCMonth() + 1,
    input.getUTCDay()
  );
  return calDate;
}

/**
 * Process property list and extract ALL event names from eventAttendedList of
 * all membership information, and sort them in ascending order (base on
 * existing event day/month info)
 */
export function extractEventList(propertyList: Property[]): string[] {
  const eventMap = new Map<string, CalendarDate>();

  propertyList.forEach((property) => {
    property.membershipList.forEach((membership) => {
      membership.eventAttendedList.forEach(({ eventName, eventDate }) => {
        // convert event date to CalendarDate to ease comparison
        const eventCalDate = toCalendarDate(eventDate);
        // # of days from Jan 1 stored in the event map
        const existingCalDate = eventMap.get(eventName);
        if (
          existingCalDate == null ||
          existingCalDate.compare(eventCalDate) > 0
        ) {
          eventMap.set(eventName, eventCalDate);
        }
      });
    });
  });

  return [...eventMap.entries()]
    .sort((a, b) => {
      // compare Calendar Date
      const calCompare = a[1].compare(b[1]);
      return calCompare !== 0
        ? calCompare
        : // compare event name
          a[0].localeCompare(b[0]);
    })
    .map(([eventName]) => eventName);
}
