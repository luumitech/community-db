import * as R from 'remeda';

/**
 * This does the opposite of `R.isEmpty()`
 *
 * It is useful because `R.isEmpty()` guard doesn't work for objects:
 *
 * This guard doesn't work negated because of typescript limitations! If you
 * need to check that an array is not empty, use R.hasAtLeast(data, 1) and not
 * !R.isEmpty(data). For strings and objects there's no way in typescript to
 * narrow the result to a non-empty type.
 *
 * So this function provides an alternate function for typescript to narrow the
 * result to a non-empty type
 */
export function isNonEmpty<T extends object>(
  data: T | null | undefined
): data is NonNullable<T> {
  const isEmpty = R.isEmpty(data as object);
  return !isEmpty;
}
