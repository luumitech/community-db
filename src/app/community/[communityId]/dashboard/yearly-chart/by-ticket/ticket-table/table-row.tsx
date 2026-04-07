import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import { type TicketStatEntry } from '../_type';

interface TableHeaderProps {
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'col-span-full grid grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'items-center text-tiny font-semibold',
        'rounded-lg px-3',
        className
      )}
      role="row"
    >
      <div role="columnheader">Event Name</div>
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
        className={twMerge(
          'col-span-full mx-3 grid grid-cols-subgrid',
          'items-center text-sm',
          className
        )}
        role="row"
      >
        <div role="cell">{ticket.eventName ?? ''}</div>
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
  eventName?: string;
  ticketName?: string;
  paymentMethod?: string;
}

/** Sum all ticket count and price for all tickets in the `ticketList` */
export const TableSumRow: React.FC<TableSumRowProps> = ({
  className,
  ticketList,
  eventName,
  ticketName,
  paymentMethod,
}) => {
  return (
    <TableRow
      className={className}
      ticket={{
        key: 'not-used',
        membershipYear: NaN,
        ticketName: ticketName ?? '',
        eventName: eventName ?? '',
        count: R.sumBy(ticketList, ({ count }) => count),
        price: decSum(...ticketList.map(({ price }) => price)),
        paymentMethod: paymentMethod ?? '',
      }}
    />
  );
};
