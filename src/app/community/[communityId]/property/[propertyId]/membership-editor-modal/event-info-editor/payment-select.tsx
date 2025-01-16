import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectSection } from '~/view/base/select';

interface Props {
  className?: string;
  yearIdx: number;
}

export const PaymentSelect: React.FC<Props> = ({ className, yearIdx }) => {
  const { selectPaymentMethodSections } = useAppContext();

  return (
    <Select
      className={clsx(className, 'max-w-xs')}
      controlName={`membershipList.${yearIdx}.paymentMethod`}
      aria-label="Payment Method"
      items={selectPaymentMethodSections}
      variant="underlined"
      // placeholder="Select a payment method"
      selectionMode="single"
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
