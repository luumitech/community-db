import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import { Button } from '~/view/base/button';
import { DragHandle } from '~/view/base/drag-reorder';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { type TicketList } from './_type';
import { PaymentDatePicker } from './payment-date-picker';
import { PaymentSelect } from './payment-select';
import { PriceInput } from './price-input';
import { TicketAddButton } from './ticket-add-button';
import { useTicketContext } from './ticket-context';
import { TicketInput } from './ticket-input';
import { TicketTypeSelect } from './ticket-type-select';
import { TransactionTotalPaymentSelect } from './transaction-total-payment-select';

interface EmptyProps {}

export const TicketRowHeader: React.FC<EmptyProps> = () => {
  return (
    <div
      className={cn(
        'col-span-full grid grid-cols-subgrid',
        'h-10 bg-default/30 text-foreground/60',
        'items-center text-xs font-semibold',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader" />
      <div role="columnheader">Ticket Type</div>
      <div role="columnheader">Ticket #</div>
      <div role="columnheader">Price</div>
      <div role="columnheader">Payment Date</div>
      <div role="columnheader">Payment Method</div>
      <div role="columnheader" />
    </div>
  );
};

interface TicketRowProps {
  ticketIdx: number;
  onRemove?: () => void;
}

export const TicketRow: React.FC<TicketRowProps> = ({
  ticketIdx,
  onRemove,
}) => {
  const { ticketDefault } = useLayoutContext();
  const { watch } = useFormContext();
  const { ticketListConfig, includeHiddenFields, transactionConfig } =
    useTicketContext();
  const { fieldMethods } = ticketListConfig;
  const controlNamePrefix = `${ticketListConfig.controlNamePrefix}.${ticketIdx}`;
  const ticketType = watch(`${controlNamePrefix}.ticketName`);

  const ticketDef = ticketDefault.get(ticketType);
  const unitPrice = ticketDef?.unitPrice ?? '0.00';

  return (
    <div className={cn('col-span-full mx-3 grid grid-cols-subgrid')} role="row">
      <div role="cell">
        <DragHandle className="pt-3" />
      </div>
      <div role="cell">
        <TicketTypeSelect
          controlNamePrefix={controlNamePrefix}
          includeHiddenFields={includeHiddenFields}
        />
      </div>
      <div role="cell">
        <TicketInput
          controlNamePrefix={controlNamePrefix}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-xs whitespace-nowrap text-foreground/60">
                ${unitPrice} ⨉
              </span>
            </div>
          }
        />
      </div>
      <div role="cell">
        <PriceInput controlNamePrefix={controlNamePrefix} />
      </div>
      <div role="cell">
        <PaymentDatePicker controlNamePrefix={controlNamePrefix} />
      </div>
      <div role="cell">
        {!transactionConfig && (
          <PaymentSelect
            controlNamePrefix={controlNamePrefix}
            includeHiddenFields={includeHiddenFields}
          />
        )}
      </div>
      <div className="flex gap-2 pt-3" role="cell">
        <FlatButton
          className="text-danger"
          icon="cross"
          tooltip="Remove Ticket"
          onClick={() => {
            fieldMethods.remove(ticketIdx);
            // Wait for remove operation to complete before calling other onRemove handlers
            setTimeout(() => onRemove?.());
          }}
        />
      </div>
    </div>
  );
};

export const TransactionHeader: React.FC<EmptyProps> = () => {
  const { ticketListConfig } = useTicketContext();

  return (
    <div className={cn('col-span-full grid')}>
      <fieldset className="border-t-2 border-divider">
        <legend className="m-auto px-4 text-sm text-foreground/60">
          Current Transaction
        </legend>
      </fieldset>
    </div>
  );
};

export const TransactionFooter: React.FC<EmptyProps> = () => {
  const { ticketListConfig } = useTicketContext();

  return (
    <div className={cn('col-span-full grid grid-cols-subgrid')}>
      <div />
      <div className="col-span-3 flex gap-2">
        <TicketAddButton
          onClick={(ticket) => {
            ticketListConfig.fieldMethods.append({ ...ticket });
          }}
        >
          <Button
            className="justify-start"
            color="primary"
            variant="bordered"
            radius="sm"
            size="sm"
            startContent={<Icon icon="add-ticket" />}
          >
            Add Ticket
          </Button>
        </TicketAddButton>
      </div>
    </div>
  );
};

export const TransactionTotal: React.FC<EmptyProps> = () => {
  const { ticketListConfig, membershipConfig, transactionConfig } =
    useTicketContext();
  const formContext = useFormContext();
  const { watch } = formContext;
  const ticketList: TicketList = watch(ticketListConfig.controlNamePrefix);
  const membershipPrice = watch(`${membershipConfig?.controlNamePrefix}.price`);
  const isMember = watch(`${membershipConfig?.controlNamePrefix}.isMember`);
  const totalPrice = decSum(
    isMember && membershipConfig ? membershipPrice : 0,
    ...ticketList.map(({ price }) => price)
  );

  if (!transactionConfig) {
    return null;
  }

  return (
    <div
      className={cn(
        'col-span-full grid grid-cols-subgrid',
        'items-center bg-default/30',
        'rounded-lg'
      )}
      role="row"
    >
      <div
        role="cell"
        className="col-span-3 text-right text-sm text-foreground/70"
      >
        Current Transaction Total
      </div>
      <div className="pl-1 text-sm" role="cell">
        <span className="pr-1.5 text-foreground/60">$</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
      <div>{/* payment date */}</div>
      <div className="col-span-2" role="cell">
        <TransactionTotalPaymentSelect
          controlName={transactionConfig.paymentControlName}
          placeholder="Select Payment"
          {...transactionConfig.selectPaymentProps}
        />
      </div>
    </div>
  );
};
