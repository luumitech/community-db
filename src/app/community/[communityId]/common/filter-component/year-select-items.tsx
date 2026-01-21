import React from 'react';
import * as R from 'remeda';

export interface YearItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item (year) */
  value: number;
}

/**
 * Return list of SelectItems that contains every year (increment by 1) using
 * the years in:
 *
 * - YearRange (min/maxYear inclusive)
 *
 * @param yearRange
 * @returns SelectItems with years in descending order
 */
export function yearSelectItems(yearRange: [number, number]) {
  const minYear = yearRange[0];
  const maxYear = yearRange[1];

  const range = R.range(minYear, maxYear + 1);
  return R.reverse(range).map((yr) => {
    return {
      label: yr.toString(),
      value: yr,
    };
  });
}
