/**
 * Validation function type
 *
 * - If validation fails, return an error message
 * - Otherwise return null
 */
export type ValidateFn<T> = (val: T | null) => string | null;

/** Validation function for checking if number is positive */
export function isPositive(msg?: string): ValidateFn<number> {
  return (val) => {
    if (val == null || val < 0) {
      return msg ?? 'Must be a positive number';
    }
    return null;
  };
}

/** Validation function for checking if number is integer */
export function isInteger(msg?: string): ValidateFn<number> {
  return (val) => {
    if (!Number.isInteger(val)) {
      return msg ?? 'Must be an integer';
    }
    return null;
  };
}

/**
 * Validation function for checking if string is non empty
 *
 * - '' is not allowed
 * - Null is not allowed
 */
export function isNonEmpty(msg?: string): ValidateFn<string> {
  return (val) => {
    if (!val?.trim()) {
      return msg ?? 'Must not be empty';
    }
    return null;
  };
}
