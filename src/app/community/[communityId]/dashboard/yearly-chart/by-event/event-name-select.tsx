import { Select, SelectItem, cn } from '@heroui/react';
import React from 'react';
import { useYearlyContext } from '../yearly-context';

interface Props {
  className?: string;
  eventList: string[];
}

export const EventNameSelect: React.FC<Props> = ({ className, eventList }) => {
  const { eventSelected, setEventSelected } = useYearlyContext();
  const eventItems = eventList.map((eventName) => ({
    label: eventName,
    value: eventName,
  }));

  return (
    <Select
      className={cn(className, 'w-full min-w-32')}
      aria-label="Event Name"
      items={eventItems}
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
