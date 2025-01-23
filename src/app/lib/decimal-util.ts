import { Decimal } from 'decimal.js';

/**
 * Check if input is a valid Decimal input. Normally `new Decimal()` throws an
 * error when the constructor argument is invalid, so we catch the error and
 * return false in that case.
 */
export function isValidDecInput(
  input?: Decimal.Value | null
): input is Decimal.Value {
  try {
    if (input == null) {
      return false;
    }
    new Decimal(input);
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
export function formatCurrency(input: Decimal.Value) {
  return new Decimal(input).toFixed(2);
}

/**
 * Calculate price using unitPrice and count
 *
 * Return result in string
 */
export function calcPrice(unitPrice?: string | null, count?: number | null) {
  if (!isValidDecInput(unitPrice) || !isValidDecInput(count)) {
    return null;
  }

  const unitPriceDec = new Decimal(unitPrice);
  const countDec = new Decimal(count);
  const defaultPriceDec = unitPriceDec.mul(countDec);
  const price = defaultPriceDec.toString();
  return price;
}

/**
 * Sum one or more decimal strings
 *
 * Return result in string
 */
export function decSum(arr: (Decimal.Value | null | undefined)[]) {
  const arrDec = arr.map((entry) =>
    isValidDecInput(entry) ? new Decimal(entry) : new Decimal(0)
  );
  const sumDec = arrDec.reduce((a, b) => a.add(b), new Decimal(0));
  return sumDec.toString();
}
