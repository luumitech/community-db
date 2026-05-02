import React from 'react';
import { twMerge } from 'tailwind-merge';
import { createSelect } from '~/view/base/select';
import { useHookFormContext, type InputData } from '../use-hook-form';
import { yearSelectItems, type YearItem } from '../year-select-items';

const Select = createSelect<InputData>();

interface Props {
  className?: string;
  yearRange: [number, number];
}

export const YearSelect: React.FC<Props> = ({ className, yearRange }) => {
  const { watch } = useHookFormContext();
  const selectedYear = watch('membership.year');

  const yearItems = React.useMemo<YearItem[]>(() => {
    const items = yearSelectItems(yearRange, selectedYear);
    const maxYear = items[0].key;

    return [
      // Add an option to add future years
      { textValue: `Add Year ${maxYear + 1}`, key: maxYear + 1 },
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
      autoFocus
    />
  );
};
