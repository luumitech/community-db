import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { getCurrentYear } from '~/lib/date-util';

export interface YearItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item (year) */
  value: number;
}

/**
 * Construct list of SelectItems that includes every year (increment by 1). Year
 * range should include the following:
 *
 * - Community min/max year information
 * - CurrentYear
 *
 * @param membershipList
 * @returns SelectItems with years in descending order
 */
export function yearSelectItems(yearRange: [number, number]) {
  const currentYear = getCurrentYear();
  const minYear = Math.min(
    ...[yearRange[0], currentYear].filter((v) => !isNaN(v))
  );
  const maxYear = Math.max(
    ...[yearRange[1], currentYear].filter((v) => !isNaN(v))
  );

  return R.reverse(R.range(minYear, maxYear + 1)).map((yr) => {
    return {
      label: yr.toString(),
      value: yr,
    };
  });
}

interface YearItemLabelProps {
  item?: YearItem | null;
}

export const YearItemLabel: React.FC<YearItemLabelProps> = ({ item }) => {
  if (!item) {
    return null;
  }

  return <div className="flex gap-2 items-center">{item.label}</div>;
};
