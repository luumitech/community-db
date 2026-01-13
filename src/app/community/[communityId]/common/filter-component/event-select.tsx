import React from 'react';
import { EventChip } from '~/community/[communityId]/common/chip/';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { renderItems } from '~/community/[communityId]/layout-util/render-select';
import {
  Select,
  type SelectProps,
  type SelectedItems,
} from '~/view/base/select';

type EventItem = ReturnType<
  typeof useLayoutContext
>['visibleEventItems'][number];

type CustomProps = Omit<SelectProps<EventItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const EventSelect: React.FC<Props> = ({ className, ...props }) => {
  const { visibleEventItems } = useLayoutContext();

  const renderValue = React.useCallback((items: SelectedItems<EventItem>) => {
    return (
      <div className="flex flex-wrap items-center gap-1">
        {items.map((item) => (
          <EventChip key={item.key} eventName={item.textValue ?? ''} />
        ))}
      </div>
    );
  }, []);

  const hasNoItems = visibleEventItems.length === 0;

  return (
    <Select
      classNames={{
        base: className,
      }}
      label="Membership Event(s)"
      selectionMode="multiple"
      isMultiline
      isDisabled={hasNoItems}
      placeholder="Unspecified"
      renderValue={renderValue}
      {...props}
    >
      {renderItems(visibleEventItems)}
    </Select>
  );
};
