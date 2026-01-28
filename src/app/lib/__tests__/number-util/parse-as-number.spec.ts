import { parseAsNumber } from '~/lib/number-util';

type TestCaseEntry = [
  unknown, // input to parseAsNumber
  number | null, // expected result
];

describe('parseAsNumber', () => {
  const tcCommon: TestCaseEntry[] = [
    [null, null],
    [undefined, null],
    ['', null],
    [' ', null],
    [true, null],
    [{ a: 1 }, null],
    ['1234', 1234],
    ['123.45', 123.45],
    [' 678 ', 678],
    ['0', 0],
    ['-34.546', -34.546],
    [4567, 4567],
    [542.11, 542.11],
    [-123.45, -123.45],
  ];

  const tcStrict: TestCaseEntry[] = [
    ['123a', null],
    ['123.45a', null],
  ];

  const tcLenient: TestCaseEntry[] = [
    ['123a', 123],
    ['123.45a', 123.45],
  ];

  test.each([...tcCommon, ...tcStrict])(
    'parse (strict mode) %s',
    (input, expected) => {
      expect(parseAsNumber(input)).toBe(expected);
    }
  );

  test.each([...tcCommon, ...tcLenient])(
    'parse (lenient mode) %s',
    (input, expected) => {
      expect(parseAsNumber(input, { lenient: true })).toBe(expected);
    }
  );
});
