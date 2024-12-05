import * as R from 'remeda';

/**
 * Parse a string as a number (support integer or floating point) Returns null
 * if:
 *
 * - Null or undefined
 * - Empty string
 * - Non numeric string
 *
 * @param val Any string
 * @returns Number or null
 */
export function parseAsNumber(val: unknown) {
  if (val == null) {
    return null;
  }
  if (typeof val === 'string') {
    if (R.isEmpty(val.trim())) {
      return null;
    }
    const num = Number(val);
    if (isNaN(num)) {
      return null;
    }
    return num;
  }

  return null;
}
