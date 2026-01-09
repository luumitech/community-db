import { type SelectedItems } from '@heroui/react';
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

interface YearItemLabelProps {
  item?: YearItem | null;
}

export const YearItemLabel: React.FC<YearItemLabelProps> = ({ item }) => {
  if (!item) {
    return null;
  }

  // Add comma separator beween items
  return (
    <span className="after:content-[','] last:after:content-['']">
      {item.label}
    </span>
  );
};

interface SelectedYearItemProps {
  items: SelectedItems<YearItem>;
}

export const SelectedYearItem: React.FC<SelectedYearItemProps> = ({
  items,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-x-2">
      {items.map((item) => (
        <YearItemLabel key={item.key} item={item.data} />
      ))}
    </div>
  );
};
