import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectSection } from '~/view/base/select';

interface Props {
  className?: string;
}

export const PaymentInfoEditor: React.FC<Props> = ({ className }) => {
  const { selectPaymentMethodSections } = useAppContext();

  return (
    <Select
      className={clsx(className)}
      controlName="membership.paymentMethod"
      label="Payment Method"
      items={selectPaymentMethodSections}
      placeholder="Select a payment method"
      selectionMode="single"
      isControlled
    >
      {(section) => (
        <SelectSection
          key={section.title}
          title={section.title}
          items={section.items}
          showDivider={section.showDivider}
        >
          {(item) => (
            <SelectItem key={item.value} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </SelectSection>
      )}
    </Select>
  );
};
