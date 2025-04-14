import type { EventEntry } from '../import/_type';
import { extractEventList, type Property } from '../import/event-list-util';

const NO_DATE: EventEntry = {
  eventName: 'Missing Date',
  eventDate: null,
  ticketList: [],
};
const NEW_YEAR: EventEntry = {
  eventName: 'New Year',
  eventDate: new Date(Date.UTC(2012, 0, 1)),
  ticketList: [],
};
const CANADA_DAY: EventEntry = {
  eventName: 'Canada Day',
  eventDate: new Date(Date.UTC(2023, 6, 1)),
  ticketList: [],
};
const XMAS: EventEntry = {
  eventName: 'Christmas',
  eventDate: new Date(Date.UTC(1997, 11, 25)),
  ticketList: [],
};
const NEW_YEAR_EVE: EventEntry = {
  eventName: 'New Year Eve',
  eventDate: new Date(Date.UTC(2010, 11, 31)),
  ticketList: [],
};
const NEW_YEAR_EVE_CLONE: EventEntry = {
  eventName: 'Fake Year Eve',
  eventDate: new Date(Date.UTC(2020, 11, 31)),
  ticketList: [],
};

describe('Event List conversion', () => {
  test('verify sort order', async () => {
    const input: Property[] = [
      {
        membershipList: [
          { year: 2000, eventAttendedList: [NEW_YEAR_EVE] },
          { year: 2000, eventAttendedList: [NEW_YEAR, XMAS] },
          { year: 2000, eventAttendedList: [CANADA_DAY] },
        ],
      },
    ];
    const actual = extractEventList(input);
    expect(actual).toEqual([
      NEW_YEAR.eventName,
      CANADA_DAY.eventName,
      XMAS.eventName,
      NEW_YEAR_EVE.eventName,
    ]);
  });

  test('empty date should go last', async () => {
    const input: Property[] = [
      {
        membershipList: [
          { year: 2000, eventAttendedList: [NO_DATE] },
          { year: 2000, eventAttendedList: [NEW_YEAR_EVE] },
        ],
      },
      {
        membershipList: [
          { year: 2000, eventAttendedList: [NEW_YEAR] },
          { year: 2000, eventAttendedList: [NEW_YEAR_EVE, XMAS] },
          { year: 2000, eventAttendedList: [] },
        ],
      },
    ];
    const actual = extractEventList(input);
    expect(actual).toEqual([
      NEW_YEAR.eventName,
      XMAS.eventName,
      NEW_YEAR_EVE.eventName,
      NO_DATE.eventName,
    ]);
  });

  test('when date is same, sort by event name', async () => {
    const input: Property[] = [
      {
        membershipList: [
          { year: 2000, eventAttendedList: [NEW_YEAR_EVE] },
          { year: 2000, eventAttendedList: [NEW_YEAR_EVE_CLONE] },
        ],
      },
    ];
    const actual = extractEventList(input);
    expect(actual).toEqual([
      NEW_YEAR_EVE_CLONE.eventName,
      NEW_YEAR_EVE.eventName,
    ]);
  });
});
