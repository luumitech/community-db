import { Select, SelectItem, SelectProps } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useHookFormContext } from '../use-hook-form';
import {
  YearItemLabel,
  yearSelectItems,
  type YearItem,
} from '../year-select-items';

type CustomSelectProps = Omit<SelectProps<YearItem>, 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
}

export const YearSelect: React.FC<Props> = ({ className, ...props }) => {
  const { minYear, maxYear } = useAppContext();
  const { register, watch, formState } = useHookFormContext();
  const selectedYear = watch('filter.memberYear');
  const { errors } = formState;

  const yearItems = React.useMemo(() => {
    return yearSelectItems([minYear, maxYear], selectedYear);
  }, [minYear, maxYear, selectedYear]);

  const error = errors.filter?.memberYear?.message;

  return (
    <Select
      classNames={{
        base: className,
      }}
      size="sm"
      label="Membership Year"
      aria-label="Membership Year"
      items={yearItems}
      isDisabled={!yearItems.length}
      selectionMode="single"
      // disallowEmptySelection
      errorMessage={error}
      isInvalid={!!error}
      {...register('filter.memberYear')}
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
