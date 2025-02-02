import { Button } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { useFormContext } from '~/custom-hooks/hook-form';
import { decSum, formatCurrency } from '~/lib/decimal-util';
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
      className={clsx(
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
  ticketIdx: number;
  onRemove?: () => void;
}

export const TicketRow: React.FC<TicketRowProps> = ({
  ticketIdx,
  onRemove,
}) => {
  const { ticketListConfig, includeHiddenFields } = useTicketContext();
  const { fieldMethods } = ticketListConfig;
  const controlNamePrefix = `${ticketListConfig.controlNamePrefix}.${ticketIdx}`;

  return (
    <div
      className={clsx('grid col-span-full grid-cols-subgrid mx-3')}
      role="row"
    >
      <div role="cell">
        <TicketTypeSelect
          controlNamePrefix={controlNamePrefix}
          includeHiddenFields={includeHiddenFields}
        />
      </div>
      <div role="cell">
        <TicketInput controlNamePrefix={controlNamePrefix} />
      </div>
      <div role="cell">
        <PriceInput controlNamePrefix={controlNamePrefix} />
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
          onClick={() => {
            fieldMethods.remove(ticketIdx);
            onRemove?.();
          }}
        />
      </div>
    </div>
  );
};

export const TransactionHeader: React.FC<EmptyProps> = () => {
  const { ticketListConfig, transactionUIConfig } = useTicketContext();
  const { paymentMethod } = transactionUIConfig;

  return (
    <div className={clsx('grid col-span-full')}>
      <TicketAddButton
        onClick={(ticket) => {
          ticketListConfig.fieldMethods.append({ ...ticket, paymentMethod });
        }}
      >
        <Button
          className="justify-start"
          color="primary"
          variant="bordered"
          radius="sm"
          fullWidth
          startContent={<Icon icon="add-ticket" />}
        >
          New Transaction
        </Button>
      </TicketAddButton>
    </div>
  );
};

export const TransactionTotal: React.FC<EmptyProps> = () => {
  const { ticketListConfig, membershipConfig, transactionUIConfig } =
    useTicketContext();
  const { watch, setValue } = useFormContext();
  const ticketList: TicketList = watch(ticketListConfig.controlNamePrefix);
  const membershipPrice = watch(`${membershipConfig?.controlNamePrefix}.price`);
  const membershipPaymentMethod = watch(
    `${membershipConfig?.controlNamePrefix}.paymentMethod`
  );
  const totalPrice = decSum(
    membershipConfig?.canEdit ? membershipPrice : 0,
    ...ticketList.map(({ price }) => price)
  );
  const { paymentMethod, setPaymentMethod } = transactionUIConfig;

  return (
    <div
      className={clsx(
        'grid col-span-full grid-cols-subgrid',
        'bg-default-100 items-center',
        'rounded-lg'
      )}
      role="row"
    >
      <div
        role="cell"
        className="col-span-2 text-sm text-right text-default-500"
      >
        Current Transaction Total
      </div>
      <div className="pl-1 text-sm" role="cell">
        <span className="text-default-400 pr-1.5">$</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>
      <div role="cell">
        <TransactionTotalPaymentSelect
          placeholder="Select Payment"
          onSelectionChange={(keys) => {
            const [firstKey] = keys;
            const selectedPaymentMethod = (firstKey as string) ?? '';
            setPaymentMethod(selectedPaymentMethod);
            if (membershipConfig && !membershipPaymentMethod) {
              setValue(
                `${membershipConfig?.controlNamePrefix}.paymentMethod`,
                selectedPaymentMethod,
                {
                  shouldDirty: true,
                  shouldValidate: true,
                }
              );
            }
            // Backfill any tickets that don't have a payment method specified
            ticketList.forEach((entry, idx) => {
              if (!entry.paymentMethod) {
                setValue(
                  `${ticketListConfig.controlNamePrefix}.${idx}.paymentMethod`,
                  selectedPaymentMethod,
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  }
                );
              }
            });
          }}
        />
      </div>
      <div className="flex gap-2" role="cell">
        <TicketAddButton
          onClick={(ticket) => {
            ticketListConfig.fieldMethods.append({ ...ticket, paymentMethod });
          }}
        />
      </div>
    </div>
  );
};

export const MembershipRow: React.FC<EmptyProps> = () => {
  const { membershipConfig, includeHiddenFields } = useTicketContext();

  if (!membershipConfig?.canEdit) {
    return null;
  }

  const { controlNamePrefix } = membershipConfig;

  return (
    <div
      className={clsx('grid col-span-full grid-cols-subgrid mx-3')}
      role="row"
    >
      <div role="cell" className="text-sm pt-2 pl-1">
        Membership Fee
      </div>
      <div role="cell" />
      <div role="cell">
        <MembershipPriceInput controlNamePrefix={controlNamePrefix} />
      </div>
      <div role="cell">
        <PaymentSelect
          controlNamePrefix={controlNamePrefix}
          includeHiddenFields={includeHiddenFields}
        />
      </div>
      <div className="flex pt-3 gap-2" role="cell" />
    </div>
  );
};
