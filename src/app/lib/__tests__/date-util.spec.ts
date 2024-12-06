import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from '@internationalized/date';
import { type DateValue } from '@nextui-org/react';
import { parseAsDate } from '../date-util';

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
    ['2010-01-01', '2010-01-01'],
    ['2010-01-01T00:00:00.000+00:00', '2010-01-01'],
    ['2010-01-01T00:00:00.000Z', '2010-01-01'],
    ['2010-01-01T00:00:00.000-1000', '2010-01-01'],
    ['2010-01-01T00:00:00.000+0100', '2010-01-01'],
    [new CalendarDate(2010, 1, 1), '2010-01-01'],
    [new CalendarDateTime(2010, 1, 1, 15, 10, 30), '2010-01-01'],
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
      '2010-01-01',
    ],
  ];

  test.each(tc)('parse %s', (input, expected) => {
    expect(parseAsDate(input)?.toString()).toBe(expected);
  });
});
