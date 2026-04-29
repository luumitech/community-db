import { cn } from '@heroui/react';
import React from 'react';
import { PlainSelect, type SelectItem } from '~/view/base/select';
import { usePageContext } from '../../page-context';

interface Props {
  className?: string;
  eventList: string[];
}

export const EventNameSelect: React.FC<Props> = ({ className, eventList }) => {
  const { eventSelected, setEventSelected } = usePageContext();
  const eventItems = eventList.map<SelectItem>((eventName) => ({
    key: eventName,
    textValue: eventName,
  }));

  return (
    <PlainSelect
      className={cn(className, 'w-full min-w-32')}
      aria-label="Event Name"
      items={eventItems}
      placeholder="Select event from list or click on bar chart"
      selectedKeys={[eventSelected]}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        setEventSelected(firstKey?.toString() ?? '');
      }}
    />
  );
};
