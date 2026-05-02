import React from 'react';
import { YearChip } from '~/community/[communityId]/common/chip';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { Select, type SelectProps } from '~/view/base/select';
import { yearSelectItems, type YearItem } from './year-select-items';

type CustomSelectProps = Omit<SelectProps<YearItem>, 'items'>;

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
    (items: YearItem[]) => {
      return (
        <div className="flex flex-wrap items-center gap-1">
          {items.map((item) => (
            <YearChip
              key={item.key}
              year={item.textValue}
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
    />
  );
};
