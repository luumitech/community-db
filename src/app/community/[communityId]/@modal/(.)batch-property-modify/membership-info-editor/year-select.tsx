import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Select, SelectItem } from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';
import { YearItemLabel, yearSelectItems } from '../year-select-items';

interface Props {
  className?: string;
  yearRange: [number, number];
}

export const YearSelect: React.FC<Props> = ({ className, yearRange }) => {
  const { watch } = useHookFormContext();
  const selectedYear = watch('membership.year');

  const yearItems = React.useMemo(() => {
    const items = yearSelectItems(yearRange, selectedYear);
    const maxYear = items[0].value;

    return [
      // Add an option to add future years
      { label: `Add Year ${maxYear + 1}`, value: maxYear + 1, isMember: null },
      ...items,
    ];
  }, [yearRange, selectedYear]);

  return (
    <Select
      classNames={{
        base: twMerge('max-w-xs', className),
        label: 'whitespace-nowrap self-center',
      }}
      controlName="membership.year"
      label="Membership Year"
      labelPlacement="outside-left"
      placeholder="Select a year"
      disallowEmptySelection
      items={yearItems}
      selectionMode="single"
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          <YearItemLabel item={item} />
        </SelectItem>
      )}
    </Select>
  );
};
