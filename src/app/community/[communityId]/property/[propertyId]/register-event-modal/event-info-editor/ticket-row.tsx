import clsx from 'clsx';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { type TicketListFieldArray } from '../use-hook-form';
import { PaymentSelect } from './payment-select';
import { PriceInput } from './price-input';
import { TicketInput } from './ticket-input';
import { TicketTypeSelect } from './ticket-type-select';

interface TicketHeaderProps {
  className?: string;
}

interface TicketRowProps {
  className?: string;
  ticketListMethods: TicketListFieldArray;
  ticketIdx: number;
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
      <div role="columnheader" />
    </div>
  );
};

export const TicketRow: React.FC<TicketRowProps> = ({
  className,
  ticketListMethods,
  ticketIdx,
}) => {
  return (
    <div
      className={clsx(className, 'grid col-span-full grid-cols-subgrid mx-3')}
      role="row"
    >
      <div role="cell">
        <TicketTypeSelect className="max-w-xs" ticketIdx={ticketIdx} />
      </div>
      <div role="cell">
        <TicketInput isControlled ticketIdx={ticketIdx} />
      </div>
      <div role="cell">
        <PriceInput isControlled ticketIdx={ticketIdx} />
      </div>
      <div role="cell">
        <PaymentSelect className="max-w-xs" ticketIdx={ticketIdx} />
      </div>
      <div className="flex items-center gap-2" role="cell">
        <FlatButton
          className="text-danger"
          icon="trash"
          tooltip="Remove Ticket"
          onClick={() => {
            ticketListMethods.remove(ticketIdx);
          }}
        />
      </div>
    </div>
  );
};
