import { formatBytes } from '~/lib/number-util';

type TestCaseEntry = [
  number, // input to parseAsNumber
  number, // decimal place
  string, // expected result
];

// 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'

describe('formatBytes', () => {
  const tc: TestCaseEntry[] = [
    [NaN, 2, '0 Bytes'],
    [-512, 2, '0 Bytes'],
    [512, 2, '512 Bytes'],
    [1024, 2, '1 KB'],
    [1024 ** 2, 2, '1 MB'],
    [1024 ** 3, 2, '1 GB'],
    [1024 ** 4, 2, '1 TB'],
    [1024 ** 5, 2, '1 PB'],
    [1024 ** 6, 2, '1 EB'],
    [1024 ** 7, 2, '1 ZB'],
    [1024 ** 8, 2, '1 YB'],
    [2000, 2, '1.95 KB'],
    [2000, 3, '1.953 KB'],
    [3000000, 0, '3 MB'],
    [3000000, 1, '2.9 MB'],
    [3000000, 2, '2.86 MB'],
  ];

  test.each(tc)('format %s', (input, decimal, expected) => {
    expect(formatBytes(input, decimal)).toBe(expected);
  });
});
