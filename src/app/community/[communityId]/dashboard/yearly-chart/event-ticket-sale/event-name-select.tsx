import { Select, SelectItem } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useYearlyContext } from '../yearly-context';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { visibleEventItems } = useAppContext();
  const { eventSelected, setEventSelected } = useYearlyContext();

  return (
    <Select
      className={clsx(className, 'min-w-32 max-w-xs')}
      aria-label="Event Name"
      items={visibleEventItems}
      placeholder="Select an event"
      selectedKeys={[eventSelected]}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        setEventSelected(firstKey?.toString() ?? '');
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
