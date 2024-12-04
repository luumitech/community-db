import { Select, SelectItem } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props {
  className?: string;
  event: Set<string>;
}

export const EventSelect: React.FC<Props> = ({ className, event }) => {
  const { visibleEventItems } = useAppContext();

  return (
    <Select
      classNames={{
        base: className,
      }}
      size="sm"
      label="Membership Event"
      aria-label="Membership Event"
      items={visibleEventItems}
      selectedKeys={event.values()}
      selectionMode="single"
      // disallowEmptySelection
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        const eventSelected = firstKey as string;
        event.clear();
        event.add(eventSelected);
      }}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
