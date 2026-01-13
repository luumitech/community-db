import React from 'react';
import { YearChip } from '~/community/[communityId]/common/chip';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  Select,
  SelectItem,
  SelectProps,
  type SelectedItems,
} from '~/view/base/select';
import { yearSelectItems, type YearItem } from './year-select-items';

type CustomSelectProps = Omit<SelectProps<YearItem>, 'children'>;

interface Props extends CustomSelectProps {
  className?: string;
  isMember: boolean;
}

export const YearSelect: React.FC<Props> = ({
  className,
  isMember,
  ...props
}) => {
  const { minYear, maxYear } = useLayoutContext();

  const yearItems = React.useMemo(() => {
    return yearSelectItems([minYear, maxYear]);
  }, [minYear, maxYear]);

  const renderValue = React.useCallback(
    (items: SelectedItems<YearItem>) => {
      return (
        <div className="flex flex-wrap items-center gap-1">
          {items.map((item) => (
            <YearChip
              key={item.key}
              year={item.data?.label ?? ''}
              isMember={isMember}
            />
          ))}
        </div>
      );
    },
    [isMember]
  );

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
      renderValue={renderValue}
      {...props}
    >
      {(item) => {
        return (
          <SelectItem key={item.value} textValue={item.label}>
            {item.label}
          </SelectItem>
        );
      }}
    </Select>
  );
};
