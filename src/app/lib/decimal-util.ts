import { Decimal } from 'decimal.js';
export { Decimal } from 'decimal.js';

/**
 * Check if input is a valid Decimal input.
 *
 * Returns false if:
 *
 * - Invalid number string (i.e. `new Decimal()` throws exception)
 * - Number is NaN
 */
export function isValidDecInput(
  input?: Decimal.Value | null
): input is Decimal.Value {
  try {
    if (input == null) {
      return false;
    }
    const dec = new Decimal(input);
    if (dec.isNaN()) {
      return false;
    }
    return true;
  } catch (e) {
    // Error initializng decimal, so input must not be a valid decimal input
    return false;
  }
}

/** Check if input contains a valid decimal that is non zero */
export function isNonZeroDec(
  input?: Decimal.Value | null
): input is Decimal.Value {
  if (!isValidDecInput(input)) {
    return false;
  }
  return !new Decimal(input).isZero();
}

/** Format a price string appropriately as a currency string */
export function formatCurrency(input: Decimal.Value | null | undefined) {
  if (!isValidDecInput(input)) {
    return '';
  }
  return new Decimal(input).toFixed(2);
}

/** Check if two decimal strings are equal */
export function decIsEqual(
  v1: Decimal.Value | null | undefined,
  v2: Decimal.Value | null | undefined
) {
  if (!isValidDecInput(v1) || !isValidDecInput(v2)) {
    return false;
  }
  const v1Dec = new Decimal(v1);
  const v2Dec = new Decimal(v2);
  return v1Dec.equals(v2);
}

/**
 * Multiply one or more decimal strings. Invalid decimal entries are treated as
 * 0.
 *
 * Return result in string
 */
export function decMul(...arr: (Decimal.Value | null | undefined)[]) {
  const arrDec = arr.map((entry) =>
    isValidDecInput(entry) ? new Decimal(entry) : new Decimal(0)
  );
  const mulDec = arrDec.reduce((a, b) => a.mul(b), new Decimal(1));
  return mulDec.toString();
}

/**
 * Sum one or more decimal strings
 *
 * Return result in string
 */
export function decSum(...arr: (Decimal.Value | null | undefined)[]) {
  const arrDec = arr.map((entry) =>
    isValidDecInput(entry) ? new Decimal(entry) : new Decimal(0)
  );
  const sumDec = arrDec.reduce((a, b) => a.add(b), new Decimal(0));
  return sumDec.toString();
}
