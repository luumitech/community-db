import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { renderItems } from '~/community/[communityId]/layout-util/render-select';
import { Select, SelectProps } from '~/view/base/select';

type EventItem = ReturnType<
  typeof useLayoutContext
>['visibleEventItems'][number];

type CustomProps = Omit<SelectProps<EventItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const EventSelect: React.FC<Props> = ({ className, ...props }) => {
  const { visibleEventItems } = useLayoutContext();

  const hasNoItems = visibleEventItems.length === 0;

  return (
    <Select
      classNames={{
        base: className,
      }}
      label="Membership Event(s)"
      selectionMode="multiple"
      isDisabled={hasNoItems}
      placeholder="Unspecified"
      {...props}
    >
      {renderItems(visibleEventItems)}
    </Select>
  );
};
