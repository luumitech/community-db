import { parseAsDate } from '../date-util';

describe('parseAsDate', () => {
  test('invalid cases', () => {
    expect(parseAsDate(null)).toBeNull();
    expect(parseAsDate(undefined)).toBeNull();
    expect(parseAsDate('abc')).toBeNull();
    expect(parseAsDate('2010')).toBeNull();
  });

  const tc = [
    ['2010-01-01', '2010-01-01'],
    ['2010-01-01T00:00:00.000+00:00', '2010-01-01'],
    ['2010-01-01T00:00:00.000Z', '2010-01-01'],
    ['2010-01-01T00:00:00.000-1000', '2010-01-01'],
    ['2010-01-01T00:00:00.000+0100', '2010-01-01'],
  ];

  it.each(tc)('parse %s', (input, expected) => {
    expect(parseAsDate(input)?.toString()).toBe(expected);
  });
});
