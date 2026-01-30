import { type DateValue } from '@heroui/react';
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from '@internationalized/date';
import { parseAsDate } from '~/lib/date-util';

type TestCaseEntry = [
  string | DateValue, // input date
  string, //expected result
];

describe('parseAsDate', () => {
  test('invalid cases', () => {
    expect(parseAsDate(null)).toBeNull();
    expect(parseAsDate(undefined)).toBeNull();
    expect(parseAsDate('abc')).toBeNull();
    expect(parseAsDate('2010')).toBeNull();
  });

  const tc: TestCaseEntry[] = [
    ['2010-01-01', '2010-01-01T00:00:00.000Z'],
    ['2010-01-01T00:00:00.000+00:00', '2010-01-01T00:00:00.000Z'],
    ['2010-01-01T00:00:00.000Z', '2010-01-01T00:00:00.000Z'],
    ['2010-01-01T00:00:00.000-1000', '2010-01-01T00:00:00.000Z'],
    ['2010-01-01T00:00:00.000+0100', '2010-01-01T00:00:00.000Z'],
    [new CalendarDate(2010, 1, 1), '2010-01-01T00:00:00.000Z'],
    [new CalendarDateTime(2010, 1, 1, 15, 10, 30), '2010-01-01T00:00:00.000Z'],
    [
      new ZonedDateTime(
        2010,
        1,
        1,
        // Time zone and UTC offset
        'America/Los_Angeles',
        -28800000,
        // Time
        9,
        15,
        0
      ),
      '2010-01-01T00:00:00.000Z',
    ],
  ];

  test.each(tc)('parse %s', (input, expected) => {
    expect(parseAsDate(input)?.toAbsoluteString()).toBe(expected);
  });
});
