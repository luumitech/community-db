import { Select, SelectItem, cn } from '@heroui/react';
import React from 'react';
import { usePageContext } from '../../page-context';

interface Props {
  className?: string;
  ticketNameList: string[];
}

export const TicketNameSelect: React.FC<Props> = ({
  className,
  ticketNameList,
}) => {
  const { ticketSelected, setTicketSelected } = usePageContext();
  const ticketItems = ticketNameList.map((ticketName) => ({
    label: ticketName,
    value: ticketName,
  }));

  return (
    <Select
      className={cn(className, 'w-full min-w-32')}
      aria-label="Ticket Name"
      items={ticketItems}
      placeholder="Select a ticket"
      selectedKeys={[ticketSelected]}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        setTicketSelected(firstKey?.toString() ?? '');
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
