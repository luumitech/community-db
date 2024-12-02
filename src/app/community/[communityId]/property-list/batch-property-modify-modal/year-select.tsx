import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useHookFormContext } from './use-hook-form';
import { YearItemLabel, yearSelectItems } from './year-select-items';

interface Props {
  className?: string;
  yearRange: [number, number];
}

export const YearSelect: React.FC<Props> = ({ className, yearRange }) => {
  const { register, formState, watch } = useHookFormContext();
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

  const { errors } = formState;
  const error = errors.membership?.year?.message;

  return (
    <Select
      classNames={{
        base: clsx(className, 'items-center'),
        label: 'whitespace-nowrap',
        mainWrapper: 'max-w-[180px]',
      }}
      label="Membership Year"
      labelPlacement="outside-left"
      placeholder="Select a year"
      disallowEmptySelection
      items={yearItems}
      selectionMode="single"
      errorMessage={error}
      isInvalid={!!error}
      {...register('membership.year')}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          <YearItemLabel item={item} />
        </SelectItem>
      )}
    </Select>
  );
};
