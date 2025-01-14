import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  Select,
  SelectItem,
  SelectProps,
  SelectSection,
} from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
  ticketIdx?: number;
}

export const PaymentSelect: React.FC<Props> = ({ className, ticketIdx }) => {
  const { visiblePaymentMethods } = useAppContext();
  const { clearErrors } = useHookFormContext();

  const controlName =
    ticketIdx == null
      ? 'membership.paymentMethod'
      : `event.ticketList.${ticketIdx}.paymentMethod`;

  return (
    <div className={clsx(className)}>
      <Select
        className="max-w-sm"
        controlName={controlName}
        aria-label="Payment Method"
        items={visiblePaymentMethods}
        variant="underlined"
        // placeholder="Select a payment method"
        selectionMode="single"
      >
        {(item) => (
          <SelectItem key={item.value} textValue={item.label}>
            {item.label}
          </SelectItem>
        )}
      </Select>
    </div>
  );
};
