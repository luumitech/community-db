import { Select, SelectItem, SelectProps } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import {
  SelectedYearItem,
  YearItemLabel,
  yearSelectItems,
  type YearItem,
} from './year-select-items';

type CustomSelectProps = Omit<SelectProps<YearItem>, 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
  yearRange: [number, number];
  year: Set<string>;
}

export const YearSelect: React.FC<Props> = ({
  className,
  yearRange,
  year,
  ...props
}) => {
  const [selectedYear] = year;
  const yearItems = React.useMemo(() => {
    return yearSelectItems(yearRange, selectedYear);
  }, [yearRange, selectedYear]);

  return (
    <Select
      classNames={{
        base: className,
      }}
      size="sm"
      items={yearItems}
      isDisabled={!yearItems.length}
      selectedKeys={year.values()}
      selectionMode="single"
      // disallowEmptySelection
      renderValue={(items) => <SelectedYearItem items={items} />}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        const yearSelected = firstKey as string;
        year.clear();
        year.add(yearSelected);
      }}
      {...props}
    >
      {(item) => {
        return (
          <SelectItem key={item.value} textValue={item.label}>
            <YearItemLabel item={item} />
          </SelectItem>
        );
      }}
    </Select>
  );
};
