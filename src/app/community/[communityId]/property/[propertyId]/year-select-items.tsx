import { Chip, type SelectedItems } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentYear } from '~/lib/date-util';
import { Icon } from '~/view/base/icon';

interface YearItem {
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
 * Return list of SelectItems that contains every year (increment by 1) using
 * the years in:
 *
 * - MembershipList (in input argument)
 * - YearToInclude (in input argument)
 * - CurrentYear
 *
 * @param membershipList
 * @param yearToInclude
 * @returns SelectItems with years in descending order
 */
export function yearSelectItems(
  membershipList: Pick<GQL.Membership, 'year' | 'isMember'>[],
  yearToInclude: string
) {
  const currentYear = getCurrentYear();
  let minYear = Math.min(parseInt(yearToInclude, 10), currentYear);
  let maxYear = Math.max(parseInt(yearToInclude, 10), currentYear);

  membershipList.forEach((entry) => {
    minYear = Math.min(minYear, entry.year);
    maxYear = Math.max(maxYear, entry.year);
  });
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
