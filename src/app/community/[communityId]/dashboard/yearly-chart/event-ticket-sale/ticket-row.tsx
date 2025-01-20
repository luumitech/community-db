import clsx from 'clsx';
import React from 'react';
import { formatCurrency } from '~/lib/decimal-util';
import { type TicketStat } from './_type';

interface TicketHeaderProps {
  className?: string;
}

export const TicketRowHeader: React.FC<TicketHeaderProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        className,
        'grid col-span-full grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'text-tiny font-semibold items-center',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader">Ticket Type</div>
      <div role="columnheader">Ticket #</div>
      <div role="columnheader">Price</div>
      <div role="columnheader">Payment Method</div>
    </div>
  );
};

interface TicketRowProps {
  className?: string;
  ticket: TicketStat;
}

export const TicketRow: React.FC<TicketRowProps> = ({ className, ticket }) => {
  return (
    <>
      <div
        className={clsx(
          className,
          'grid col-span-full grid-cols-subgrid mx-3',
          'text-sm items-center'
        )}
        role="row"
      >
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
