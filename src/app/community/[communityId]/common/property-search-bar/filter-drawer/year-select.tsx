import { cn } from '@heroui/react';
import React from 'react';
import { Select, SelectItem, SelectProps } from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';
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
  controlName: 'memberYear' | 'nonMemberYear';
}

export const YearSelect: React.FC<Props> = ({
  className,
  yearRange,
  controlName,
  ...props
}) => {
  const { watch } = useHookFormContext();
  const selectedYear = watch(controlName);

  const yearItems = React.useMemo(() => {
    return yearSelectItems(yearRange, selectedYear);
  }, [yearRange, selectedYear]);

  return (
    <Select
      classNames={{
        base: className,
      }}
      size="sm"
      controlName={controlName}
      items={yearItems}
      isDisabled={!yearItems.length}
      selectionMode="single"
      // disallowEmptySelection
      {...props}
      renderValue={(items) => <SelectedYearItem items={items} />}
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
