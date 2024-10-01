import { Select, SelectItem } from '@nextui-org/react';
import { useSet } from '@uidotdev/usehooks';
import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import {
  SelectedYearItem,
  YearItemLabel,
  yearSelectItems,
} from '../year-select-items';

interface Props {
  className?: string;
  membershipList: GQL.PropertyId_MembershipDisplayFragment['membershipList'];
  selectedYear: string;
  onChange: (year: string) => void;
}

export const YearSelect: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  membershipList,
  selectedYear,
  onChange,
  children,
}) => {
  const year = useSet([selectedYear]);
  const yearItems = React.useMemo(() => {
    return yearSelectItems(membershipList, selectedYear);
  }, [membershipList, selectedYear]);

  return (
    <div className={clsx(className, 'flex flex-grow items-center gap-2')}>
      {children}
      <Select
        classNames={{
          base: 'max-w-[150px]',
        }}
        aria-label="Membership Year"
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
          onChange(yearSelected);
        }}
      >
        {(item) => (
          <SelectItem key={item.value} textValue={item.label}>
            <YearItemLabel item={item} />
          </SelectItem>
        )}
      </Select>
    </div>
  );
};
