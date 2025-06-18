/**
 * Validation function type
 *
 * - If validation fails, return an error message
 * - Otherwise return null
 */
export type ValidateFn<T> = (val: T) => string | null;

/** Validation function for checking if number is positive */
export function isPositive(msg?: string): ValidateFn<number> {
  return (val) => {
    if (val < 0) {
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
