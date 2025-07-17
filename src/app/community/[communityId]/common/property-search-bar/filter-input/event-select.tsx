import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { Select, SelectItem, SelectProps } from '~/view/base/select';

type EventItem = ReturnType<
  typeof useLayoutContext
>['visibleEventItems'][number];

type CustomProps = Omit<SelectProps<EventItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const EventSelect: React.FC<Props> = ({ className, ...props }) => {
  const { visibleEventItems } = useLayoutContext();

  return (
    <Select
      classNames={{
        base: className,
      }}
      label="Membership Event"
      items={visibleEventItems}
      selectionMode="single"
      isDisabled={!visibleEventItems.length}
      placeholder="Unspecified"
      {...props}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
