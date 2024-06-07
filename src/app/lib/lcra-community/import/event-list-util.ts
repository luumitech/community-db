import { CalendarDate } from '@internationalized/date';
import type { Membership } from '@prisma/client';
import { isValidDate } from '~/lib/date-util';

export interface Property {
  membershipList: Pick<Membership, 'eventAttendedList'>[];
}

/**
 * Extract the Month/Day from UTC date and create a
 * CalendarDate object on year 2000.  So we can compare
 * two date object by distance to Jan 1, 2000
 */
function toCalendarDate(input: Date | null) {
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
 * Process property list and extract event information from all
 * the events from eventAttendedList, and sort them in ascending
 * order
 */
export function extractEventList(propertyList: Property[]) {
  const eventMap = new Map<string, CalendarDate>();

  const membershipList = propertyList.flatMap((entry) => entry.membershipList);
  membershipList.forEach((entry) => {
    entry.eventAttendedList.forEach(({ eventName, eventDate }) => {
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
