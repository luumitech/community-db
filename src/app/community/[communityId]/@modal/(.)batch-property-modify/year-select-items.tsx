import React from 'react';
import * as R from 'remeda';
import { getCurrentYear } from '~/lib/date-util';
import { type SelectItem } from '~/view/base/select';

export interface YearItem extends SelectItem {
  /** Value corresponding to the selection item (year) */
  key: number;
  /** Label to appear in selection list */
  textValue: string;
}

interface YearItemLabelProps {
  item?: YearItem | null;
}

const YearItemLabel: React.FC<YearItemLabelProps> = ({ item }) => {
  if (!item) {
    return null;
  }

  return <div className="flex items-center gap-2">{item.textValue}</div>;
};

/**
 * Construct list of SelectItems that includes every year (increment by 1). Year
 * range should include the following:
 *
 * - Community min/max year information
 * - YearToInclude (selected year)
 * - CurrentYear
 *
 * @param membershipList
 * @param yearToInclude
 * @returns SelectItems with years in descending order
 */
export function yearSelectItems(
  yearRange: [number, number],
  _yearToInclude?: string | number | null
): YearItem[] {
  const yearToIncludeNum = Number(_yearToInclude);
  const yearToInclude = yearToIncludeNum <= 0 ? NaN : yearToIncludeNum;
  const currentYear = getCurrentYear();
  const minYear = Math.min(
    ...[yearRange[0], yearToInclude, currentYear].filter((v) => !isNaN(v))
  );
  const maxYear = Math.max(
    ...[yearRange[1], yearToInclude, currentYear].filter((v) => !isNaN(v))
  );

  return R.reverse(R.range(minYear, maxYear + 1)).map((yr) => {
    const item = {
      key: yr,
      textValue: yr.toString(),
    };
    return {
      ...item,
      rendered: <YearItemLabel item={item} />,
    };
  });
}
