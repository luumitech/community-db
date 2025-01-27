import { Select, SelectItem, SelectProps } from '@nextui-org/react';
import { useSet } from '@uidotdev/usehooks';
import clsx from 'clsx';
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
  selectedYear: string;
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
  const year = useSet([selectedYear]);
  const yearItems = React.useMemo(() => {
    return yearSelectItems(yearRange, membershipList, selectedYear);
  }, [yearRange, membershipList, selectedYear]);

  return (
    <Select
      classNames={{
        base: clsx(className, 'items-start'),
        label: 'whitespace-nowrap',
        mainWrapper: 'min-w-32 max-w-xs',
      }}
      // label="Membership Info For Year"
      // labelPlacement="outside-left"
      aria-label="Membership Info For Year"
      placeholder="Select a year"
      items={yearItems}
      selectedKeys={year.values()}
      selectionMode="single"
      disallowEmptySelection
      renderValue={(items) => <SelectedYearItem items={items} />}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        const yearSelected = firstKey as string;
        year.clear();
        year.add(yearSelected);
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
