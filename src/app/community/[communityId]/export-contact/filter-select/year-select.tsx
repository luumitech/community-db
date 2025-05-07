import { cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectProps } from '~/view/base/select';
import {
  YearItemLabel,
  yearSelectItems,
  type YearItem,
} from './year-select-items';

type CustomSelectProps = Omit<SelectProps<YearItem>, 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
}

export const YearSelect: React.FC<Props> = ({ className, ...props }) => {
  const { minYear, maxYear } = useAppContext();

  const yearItems = React.useMemo(() => {
    return yearSelectItems([minYear, maxYear]);
  }, [minYear, maxYear]);

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      label="Membership Year"
      size="sm"
      items={yearItems}
      isDisabled={!yearItems.length}
      selectionMode="single"
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
