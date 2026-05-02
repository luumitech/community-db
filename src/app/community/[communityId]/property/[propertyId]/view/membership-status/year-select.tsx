import { cn } from '@heroui/react';
import React from 'react';
import {
  SelectedYearItem,
  yearSelectItems,
  type YearItem,
} from '~/community/[communityId]/property/[propertyId]/year-select-items';
import * as GQL from '~/graphql/generated/graphql';
import { PlainSelect, type PlainSelectProps } from '~/view/base/select';

type CustomSelectProps = Omit<PlainSelectProps<YearItem>, 'items'>;

interface Props extends CustomSelectProps {
  className?: string;
  yearRange: [number, number];
  membershipList: GQL.PropertyId_MembershipStatusFragment['membershipList'];
  selectedYear?: number | null;
  onYearChange: (year: number) => void;
}

export const YearSelect: React.FC<Props> = ({
  className,
  yearRange,
  membershipList,
  selectedYear,
  onYearChange,
  ...props
}) => {
  const yearItems = React.useMemo(() => {
    return yearSelectItems(yearRange, membershipList, selectedYear);
  }, [yearRange, membershipList, selectedYear]);

  return (
    <PlainSelect
      classNames={{
        base: cn(className, 'items-start'),
        label: 'whitespace-nowrap',
        mainWrapper: 'min-w-32 max-w-xs',
      }}
      // label="Membership Info For Year"
      aria-label="Membership Info For Year"
      placeholder="Select a year"
      items={yearItems}
      selectedKeys={selectedYear != null ? [selectedYear.toString()] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        const asNum = parseInt(firstKey as string, 10);
        onYearChange(asNum);
      }}
      disallowEmptySelection
      renderValue={(items) => <SelectedYearItem items={items} />}
      {...props}
    />
  );
};
