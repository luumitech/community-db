import { cn } from '@heroui/react';
import React from 'react';
import { PlainSelect, type SelectItem } from '~/view/base/select';
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
  const ticketItems = ticketNameList.map<SelectItem>((ticketName) => ({
    key: ticketName,
    textValue: ticketName,
  }));

  return (
    <PlainSelect
      className={cn(className, 'w-full min-w-32')}
      aria-label="Ticket Name"
      items={ticketItems}
      placeholder="Select a ticket"
      selectedKeys={[ticketSelected]}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        setTicketSelected(firstKey?.toString() ?? '');
      }}
    />
  );
};
