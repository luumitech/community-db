import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props {
  className?: string;
}

export const EventDefaultSelect: React.FC<Props> = ({ className }) => {
  const { visibleEventItems, communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;

  return (
    <Select
      className={clsx(className, 'max-w-sm')}
      aria-label="Event Name"
      items={visibleEventItems}
      label="Select Current Event"
      placeholder="Select an event"
      selectionMode="single"
      defaultSelectedKeys={lastEventSelected ? [lastEventSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        communityUi.actions.setLastEventSelected(
          firstKey?.toString() ?? undefined
        );
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
