import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { Select, SelectItem, SelectProps } from '~/view/base/select';
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
      selectionMode="multiple"
      isMultiline
      placeholder="Unspecified"
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
