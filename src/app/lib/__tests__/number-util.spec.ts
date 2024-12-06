import { parseAsNumber } from '../number-util';

type TestCaseEntry = [
  unknown, // input to parseAsNumber
  number, // expected result
];

describe('parseAsNumber', () => {
  test('invalid cases', () => {
    expect(parseAsNumber(null)).toBeNull();
    expect(parseAsNumber(undefined)).toBeNull();
    expect(parseAsNumber('')).toBeNull();
    expect(parseAsNumber(' ')).toBeNull();
    expect(parseAsNumber('123a')).toBeNull();
  });

  const tc: TestCaseEntry[] = [
    ['1234', 1234],
    ['123.45', 123.45],
    [' 678 ', 678],
    ['0', 0],
    ['-34.546', -34.546],
    [4567, 4567],
    [542.11, 542.11],
    [-123.45, -123.45],
  ];

  test.each(tc)('parse %s', (input, expected) => {
    expect(parseAsNumber(input)).toBe(expected);
  });
});
