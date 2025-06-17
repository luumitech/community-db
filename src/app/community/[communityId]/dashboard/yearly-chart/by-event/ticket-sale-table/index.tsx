import { Card, CardHeader, cn } from '@heroui/react';
import React from 'react';
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
      <CardHeader className="font-semibold">Ticket Sale</CardHeader>
      {ticketList.length === 0 ? (
        <NoTicket />
      ) : (
        <TicketTable ticketList={ticketList} />
      )}
    </Card>
  );
};
