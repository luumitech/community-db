import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { Select, SelectItem, SelectProps } from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';
import {
  YearItemLabel,
  yearSelectItems,
  type YearItem,
} from '../year-select-items';

type CustomSelectProps = Omit<
  SelectProps<YearItem>,
  'controlName' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
}

export const YearSelect: React.FC<Props> = ({ className, ...props }) => {
  const { minYear, maxYear } = useLayoutContext();
  const { watch } = useHookFormContext();
  const selectedYear = watch('filter.memberYear');

  const yearItems = React.useMemo(() => {
    return yearSelectItems([minYear, maxYear], selectedYear);
  }, [minYear, maxYear, selectedYear]);

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      controlName="filter.memberYear"
      label="Membership Year"
      size="sm"
      items={yearItems}
      isDisabled={!yearItems.length}
      selectionMode="single"
      placeholder="Unspecified"
      // disallowEmptySelection
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
