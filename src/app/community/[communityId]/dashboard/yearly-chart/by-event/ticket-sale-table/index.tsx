import { cn } from '@heroui/react';
import React from 'react';
import { Card } from '~/view/base/card';
import { type TicketStat } from '../_type';
import { NoTicket } from './no-ticket';
import { TicketTable } from './ticket-table';

export interface Props {
  className?: string;
  ticketList: TicketStat;
}

export const TicketSaleTable: React.FC<Props> = ({ className, ticketList }) => {
  return (
    <Card className={cn(className)} shadow="sm">
      <Card.Header className="font-semibold">Ticket Sale</Card.Header>
      {ticketList.length === 0 ? (
        <NoTicket />
      ) : (
        <TicketTable ticketList={ticketList} />
      )}
    </Card>
  );
};
