import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem } from '~/view/base/select';

interface Props {
  className?: string;
}

export const PaymentSelect: React.FC<Props> = ({ className }) => {
  const { visiblePaymentMethods } = useAppContext();

  return (
    <Select
      className={clsx(className, 'min-w-32 max-w-xs')}
      controlName="membership.paymentMethod"
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
  );
};
