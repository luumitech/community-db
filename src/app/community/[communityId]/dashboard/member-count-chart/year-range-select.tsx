import { Select, SelectItem, SelectProps } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';

interface YearRangeSelectItem {
  label: string;
  value: number;
}
const yearRangeSelectionList: YearRangeSelectItem[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: 'Max', value: -1 },
];

interface Props extends Omit<SelectProps<YearRangeSelectItem>, 'children'> {
  className?: string;
}

export const YearRangeSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Select
      className={clsx(className, 'max-w-[150px]')}
      label="Years To Show"
      items={yearRangeSelectionList}
      disallowEmptySelection
      {...props}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
