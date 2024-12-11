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
