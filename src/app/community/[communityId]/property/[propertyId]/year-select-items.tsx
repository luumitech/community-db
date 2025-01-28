import { Chip, type SelectedItems } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentYear } from '~/lib/date-util';
import { Icon } from '~/view/base/icon';

export interface YearItem {
  /** Label to appear in selection list */
  label: string;
  /** Value corresponding to the selection item (year) */
  value: number;
  /**
   * Whether membership is active for the year item null means not to render
   * membership status icon
   */
  isMember: boolean | null;
}

/**
 * Construct list of SelectItems that includes every year (increment by 1). Year
 * range should include the following:
 *
 * - Community min/max year information
 * - YearToInclude (selected year)
 * - CurrentYear
 *
 * @param membershipList
 * @param yearToIncludeStr
 * @returns SelectItems with years in descending order
 */
export function yearSelectItems(
  yearRange: [number, number],
  membershipList: Pick<GQL.Membership, 'year' | 'isMember'>[],
  yearToIncludeStr: string
) {
  const yearToInclude = parseInt(yearToIncludeStr ?? '', 10);
  const currentYear = getCurrentYear();
  const minYear = Math.min(
    ...[yearRange[0], yearToInclude, currentYear].filter((v) => !isNaN(v))
  );
  const maxYear = Math.max(
    ...[yearRange[1], yearToInclude, currentYear].filter((v) => !isNaN(v))
  );

  return R.reverse(R.range(minYear, maxYear + 1)).map((yr) => {
    return {
      label: yr.toString(),
      value: yr,
      isMember: !!membershipList.find((entry) => entry.year === yr)?.isMember,
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

  return (
    <div className="flex gap-2 items-center">
      {item.label}
      <div className="grow" />
      {item.isMember != null && (
        <Chip
          variant="bordered"
          radius="md"
          size="sm"
          color={item.isMember ? 'success' : 'default'}
        >
          <Icon icon={item.isMember ? 'thumb-up' : 'thumb-down'} size={14} />
        </Chip>
      )}
    </div>
  );
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
