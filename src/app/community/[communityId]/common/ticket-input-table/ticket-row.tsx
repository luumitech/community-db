import { Button, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import { DragHandle } from '~/view/base/drag-reorder';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { type TicketList } from './_type';
import { MembershipPriceInput } from './membership-price-input';
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
        'grid col-span-full grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'text-tiny font-semibold items-center',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader" />
      <div role="columnheader">Ticket Type</div>
      <div role="columnheader">Ticket #</div>
      <div role="columnheader">Price</div>
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
    <div className={cn('grid col-span-full grid-cols-subgrid mx-3')} role="row">
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
              <span className="text-default-400 text-xs whitespace-nowrap">
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
        {!transactionConfig && (
          <PaymentSelect
            controlNamePrefix={controlNamePrefix}
            includeHiddenFields={includeHiddenFields}
          />
        )}
      </div>
      <div className="flex pt-3 gap-2" role="cell">
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
    <div className={cn('grid col-span-full')}>
      <fieldset className="border-t-2 border-divider">
        <legend className="text-sm text-default-400 m-auto px-4">
          Current Transaction
        </legend>
      </fieldset>
    </div>
  );
};

export const TransactionFooter: React.FC<EmptyProps> = () => {
  const { ticketListConfig } = useTicketContext();

  return (
    <div className={cn('grid col-span-full')}>
      <div className="ml-3">
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
  const { watch, clearErrors } = useFormContext();
  const ticketList: TicketList = watch(ticketListConfig.controlNamePrefix);
  const membershipPrice = watch(`${membershipConfig?.controlNamePrefix}.price`);
  const totalPrice = decSum(
    membershipConfig?.canEdit ? membershipPrice : 0,
    ...ticketList.map(({ price }) => price)
  );
  return (
    <div
      className={cn(
        'grid col-span-full grid-cols-subgrid',
        'bg-default-100 items-center',
        'rounded-lg'
      )}
      role="row"
    >
      <div
        role="cell"
        className="col-span-3 text-sm text-right text-default-500"
      >
        Current Transaction Total
      </div>
      <div className="pl-1 text-sm" role="cell">
        <span className="text-default-400 pr-1.5">$</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
      <div role="cell">
        <TransactionTotalPaymentSelect
          controlName={`${transactionConfig?.controlNamePrefix}.paymentMethod`}
          placeholder="Select Payment"
          {...transactionConfig?.selectPaymentProps}
        />
      </div>
      <div className="flex gap-2" role="cell">
        {/* <TicketAddButton
          onClick={(ticket) => {
            ticketListConfig.fieldMethods.append({ ...ticket, paymentMethod });
          }}
        /> */}
      </div>
    </div>
  );
};

export const MembershipRow: React.FC<EmptyProps> = () => {
  const { membershipConfig, includeHiddenFields, transactionConfig } =
    useTicketContext();

  if (!membershipConfig?.canEdit) {
    return null;
  }

  const { controlNamePrefix } = membershipConfig;

  return (
    <div className={cn('grid col-span-full grid-cols-subgrid mx-3')} role="row">
      <div role="cell" />
      <div role="cell" className="text-sm pt-2 pl-1">
        Membership Fee
      </div>
      <div role="cell" />
      <div role="cell">
        <MembershipPriceInput controlNamePrefix={controlNamePrefix} />
      </div>
      <div role="cell">
        {!transactionConfig && (
          <PaymentSelect
            controlNamePrefix={controlNamePrefix}
            includeHiddenFields={includeHiddenFields}
          />
        )}
      </div>
      <div className="flex pt-3 gap-2" role="cell" />
    </div>
  );
};
