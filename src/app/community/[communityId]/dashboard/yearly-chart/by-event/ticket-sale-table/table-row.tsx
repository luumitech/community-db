import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import { type TicketStatEntry } from '../_type';

interface TableHeaderProps {
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        className,
        'grid col-span-full grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'text-tiny font-semibold items-center',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader">Membership Year</div>
      <div role="columnheader">Ticket Type</div>
      <div role="columnheader">Ticket #</div>
      <div role="columnheader">Price</div>
      <div role="columnheader">Payment Method</div>
    </div>
  );
};

interface TableRowProps {
  className?: string;
  ticket: TicketStatEntry;
}

export const TableRow: React.FC<TableRowProps> = ({ className, ticket }) => {
  return (
    <>
      <div
        className={cn(
          className,
          'grid col-span-full grid-cols-subgrid mx-3',
          'text-sm items-center'
        )}
        role="row"
      >
        <div role="cell">{ticket.membershipYear || ''}</div>
        <div role="cell">{ticket.ticketName}</div>
        <div className="flex justify-end" role="cell">
          <span className="font-mono">{ticket.count}</span>
        </div>
        <div className="flex justify-between gap-2" role="cell">
          <span className="text-default-400">$</span>
          <span className="font-mono">{formatCurrency(ticket.price)}</span>
        </div>
        <div role="cell">{ticket.paymentMethod}</div>
      </div>
    </>
  );
};

interface TableSumRowProps {
  className?: string;
  ticketList: TicketStatEntry[];
  membershipYear?: number;
  ticketName?: string;
  paymentMethod?: string;
}

/** Sum all ticket count and price for all tickets in the `ticketList` */
export const TableSumRow: React.FC<TableSumRowProps> = ({
  className,
  ticketList,
  membershipYear,
  ticketName,
  paymentMethod,
}) => {
  return (
    <TableRow
      className={className}
      ticket={{
        key: 'not-used',
        eventName: 'not-used',
        ticketName: ticketName ?? '',
        membershipYear: membershipYear ?? 0,
        count: R.sumBy(ticketList, ({ count }) => count),
        price: decSum(...ticketList.map(({ price }) => price)),
        paymentMethod: paymentMethod ?? '',
      }}
    />
  );
};
