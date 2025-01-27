import clsx from 'clsx';
import React from 'react';
import { FlatButton } from '~/view/base/flat-button';
import { PaymentSelect } from './payment-select';
import { PriceInput } from './price-input';
import { TicketInput } from './ticket-input';
import { TicketTypeSelect } from './ticket-type-select';

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
      <div role="columnheader" />
    </div>
  );
};

interface TicketRowProps {
  className?: string;
  controlNamePrefix: string;
  includeHiddenFields?: boolean;
  onRemove?: () => void;
}

export const TicketRow: React.FC<TicketRowProps> = ({
  className,
  controlNamePrefix,
  includeHiddenFields,
  onRemove,
}) => {
  return (
    <div
      className={clsx(className, 'grid col-span-full grid-cols-subgrid mx-3')}
      role="row"
    >
      <div role="cell">
        <TicketTypeSelect
          controlNamePrefix={controlNamePrefix}
          includeHiddenFields={includeHiddenFields}
        />
      </div>
      <div role="cell">
        <TicketInput isControlled controlNamePrefix={controlNamePrefix} />
      </div>
      <div role="cell">
        <PriceInput isControlled controlNamePrefix={controlNamePrefix} />
      </div>
      <div role="cell">
        <PaymentSelect
          controlNamePrefix={controlNamePrefix}
          includeHiddenFields={includeHiddenFields}
        />
      </div>
      <div className="flex pt-3 gap-2" role="cell">
        <FlatButton
          className="text-danger"
          icon="trash"
          tooltip="Remove Ticket"
          onClick={onRemove}
        />
      </div>
    </div>
  );
};
