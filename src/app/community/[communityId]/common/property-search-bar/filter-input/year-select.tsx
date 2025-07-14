import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
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
}

export const YearSelect: React.FC<Props> = ({ className, ...props }) => {
  const { minYear, maxYear } = useLayoutContext();
  const { watch } = useHookFormContext();

  const yearItems = React.useMemo(() => {
    return yearSelectItems([minYear, maxYear]);
  }, [minYear, maxYear]);

  return (
    <Select
      classNames={{
        base: className,
      }}
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
