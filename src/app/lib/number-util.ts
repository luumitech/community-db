import * as R from 'remeda';

interface ParseAsNumberOpt {
  /** Allow partial string (i.e. '3px') to return a number as well */
  lenient?: boolean;
}

/**
 * Parse any type as a number (support integer or floating point).
 *
 * Returns null if:
 *
 * - Null or undefined
 * - Empty string
 * - Non numeric string
 * - Boolean (true or false)
 * - If lenient mode, allow string with partial number (i.e. 10px)
 *
 * @param val Any string
 * @returns Number or null
 */
export function parseAsNumber(input: unknown, opt?: ParseAsNumberOpt) {
  if (input == null) {
    return null;
  }
  if (typeof input === 'string' && R.isEmpty(input.trim())) {
    // empty string is considered to be invalid number
    // need to check this because Number('') returns 0
    return null;
  }
  if (typeof input === 'boolean') {
    return null;
  }

  const num =
    typeof input === 'string' && opt?.lenient
      ? parseFloat(input)
      : Number(input);

  if (isNaN(num)) {
    return null;
  }
  return num;
}

/**
 * Format byte number in short forms
 *
 * @example Expect(formatBytes(1024)).toBe('1 KB')
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (Number.isNaN(bytes) || bytes <= 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
