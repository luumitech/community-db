import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { Controller } from '~/custom-hooks/hook-form';
import { useHookFormContext } from './use-hook-form';
import {
  SelectedYearItem,
  YearItemLabel,
  yearSelectItems,
} from './year-select-items';

interface Props {
  className?: string;
  yearRange: [number, number];
}

export const YearSelect: React.FC<Props> = ({ className, yearRange }) => {
  const { control, formState, watch } = useHookFormContext();
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
    <Controller
      control={control}
      name="membership.year"
      render={({ field }) => (
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
          selectedKeys={field.value ? [field.value.toString()] : []}
          selectionMode="single"
          onChange={field.onChange}
          errorMessage={error}
          isInvalid={!!error}
          renderValue={(items) => <SelectedYearItem items={items} />}
        >
          {(item) => (
            <SelectItem key={item.value} textValue={item.label}>
              <YearItemLabel item={item} />
            </SelectItem>
          )}
        </Select>
      )}
    />
  );
};
