import { Select, SelectItem, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { getCurrentDate } from '~/lib/date-util';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { visibleEventItems, communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      aria-label="Current Event Name"
      items={visibleEventItems}
      placeholder="Select current event"
      description={getCurrentDate()}
      selectedKeys={lastEventSelected ? [lastEventSelected] : []}
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
