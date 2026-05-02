import React from 'react';
import * as R from 'remeda';
import { type SelectItem } from '~/view/base/select';

export interface YearItem extends SelectItem {
  /** Value corresponding to the selection item (year) */
  key: number;
  /** Label to appear in selection list */
  textValue: string;
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
export function yearSelectItems(yearRange: [number, number]): YearItem[] {
  const minYear = yearRange[0];
  const maxYear = yearRange[1];

  const range = R.range(minYear, maxYear + 1);
  return R.reverse(range).map((yr) => {
    return {
      key: yr,
      textValue: yr.toString(),
    };
  });
}
