import { Select, SelectItem } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props {
  className?: string;
  eventSelected: string;
  onEventSelected: (eventName: string) => void;
}

export const EventNameSelect: React.FC<Props> = ({
  className,
  eventSelected,
  onEventSelected,
}) => {
  const { visibleEventItems } = useAppContext();

  return (
    <Select
      className={clsx(className, 'max-w-xs')}
      aria-label="Event Name"
      items={visibleEventItems}
      placeholder="Select an event"
      selectedKeys={[eventSelected]}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        onEventSelected(firstKey?.toString() ?? '');
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
