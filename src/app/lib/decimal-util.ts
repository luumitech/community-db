import { Decimal } from 'decimal.js';

/**
 * Calculate price using unitPrice and count
 *
 * Return result in string
 */
export function calcPrice(unitPrice?: string | null, count?: number | null) {
  if (!unitPrice || !count) {
    return null;
  }

  const unitPriceDec = new Decimal(unitPrice);
  const countDec = new Decimal(count);
  const defaultPriceDec = unitPriceDec.mul(countDec);
  const price = defaultPriceDec.toString();
  return price;
}
