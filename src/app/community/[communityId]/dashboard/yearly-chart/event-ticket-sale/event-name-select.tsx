import { Select, SelectItem, cn } from '@heroui/react';
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
      className={cn(className, 'min-w-32 w-full')}
      aria-label="Event Name"
      items={visibleEventItems}
      placeholder="Select event from list or click on bar chart"
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
