import { Select, SelectItem, SelectProps, cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import {
  SelectedYearItem,
  YearItemLabel,
  yearSelectItems,
  type YearItem,
} from '../year-select-items';

type CustomSelectProps = Omit<SelectProps<YearItem>, 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
  yearRange: [number, number];
  membershipList: GQL.PropertyId_MembershipDisplayFragment['membershipList'];
  selectedYear?: string | null;
  onYearChange: (year: string) => void;
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
    <Select
      classNames={{
        base: cn(className, 'items-start'),
        label: 'whitespace-nowrap',
        mainWrapper: 'min-w-32 max-w-xs',
      }}
      // label="Membership Info For Year"
      // labelPlacement="outside-left"
      aria-label="Membership Info For Year"
      placeholder="Select a year"
      items={yearItems}
      selectedKeys={selectedYear ? [selectedYear] : []}
      selectionMode="single"
      disallowEmptySelection
      renderValue={(items) => <SelectedYearItem items={items} />}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        const yearSelected = firstKey as string;
        onYearChange(yearSelected);
      }}
      {...props}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          <YearItemLabel item={item} />
        </SelectItem>
      )}
    </Select>
  );
};
