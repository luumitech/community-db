import React from 'react';
import { EventChip } from '~/community/[communityId]/common/chip/';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { type SelectItemT } from '~/community/[communityId]/layout-util/community-context';
import { Select, type SelectProps } from '~/view/base/select';

type CustomProps = Omit<SelectProps<SelectItemT>, 'items'>;

interface Props extends CustomProps {
  className?: string;
}

export const EventSelect: React.FC<Props> = ({ className, ...props }) => {
  const { visibleEventItems } = useLayoutContext();

  const renderValue = React.useCallback((items: SelectItemT[]) => {
    return (
      <div className="flex flex-wrap items-center gap-1">
        {items.map((item) => (
          <EventChip key={item.key} eventName={item.textValue ?? ''} />
        ))}
      </div>
    );
  }, []);

  return (
    <Select
      classNames={{
        base: className,
      }}
      label="Membership Event(s)"
      selectionMode="multiple"
      isMultiline
      placeholder="Unspecified"
      items={visibleEventItems}
      renderValue={renderValue}
      {...props}
    />
  );
};
