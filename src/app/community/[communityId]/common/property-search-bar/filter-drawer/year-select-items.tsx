import { type SelectedItems } from '@heroui/react';
import clsx from 'clsx';
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
 * - YearToInclude (in input argument)
 *
 * @param yearRange
 * @param yearToInclude
 * @returns SelectItems with years in descending order
 */
export function yearSelectItems(
  yearRange: [number, number],
  yearToIncludeStr?: string
) {
  const yearToInclude = parseInt(yearToIncludeStr ?? '', 10);
  const minYear = Math.min(
    ...[yearRange[0], yearToInclude].filter((v) => !isNaN(v))
  );
  const maxYear = Math.max(
    ...[yearRange[1], yearToInclude].filter((v) => !isNaN(v))
  );

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

  return <div className="flex gap-2 items-center">{item.label}</div>;
};

interface SelectedYearItemProps {
  items: SelectedItems<YearItem>;
}

export const SelectedYearItem: React.FC<SelectedYearItemProps> = ({
  items,
}) => {
  return (
    <div>
      {items.map((item) => (
        <YearItemLabel key={item.key} item={item.data} />
      ))}
    </div>
  );
};
