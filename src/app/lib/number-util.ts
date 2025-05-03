import * as R from 'remeda';

/**
 * Parse any type as a number (support integer or floating point).
 *
 * Returns null if:
 *
 * - Null or undefined
 * - Empty string
 * - Non numeric string
 *
 * @param val Any string
 * @returns Number or null
 */
export function parseAsNumber(input: unknown) {
  if (input == null) {
    return null;
  }
  if (typeof input === 'string' && R.isEmpty(input.trim())) {
    // empty string is considered to be invalid number
    // need to check this because Number('') returns 0
    return null;
  }

  const num = Number(input);
  if (isNaN(num)) {
    return null;
  }
  return num;
}

/**
 * Format byte number in short forms
 *
 * @example Expect(formatBytes(1000)).toBe('1 KB')
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
