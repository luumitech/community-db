import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectSection } from '~/view/base/select';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
  yearIdx: number;
}

export const PaymentInfoEditor: React.FC<Props> = ({ className, yearIdx }) => {
  const { selectPaymentMethodSections } = useAppContext();
  const { formState } = useHookFormContext();

  return (
    <div className={clsx(className)}>
      <Select
        className="max-w-sm"
        controlName={`membershipList.${yearIdx}.paymentMethod`}
        label="Payment Method"
        items={selectPaymentMethodSections}
        placeholder="Select a payment method"
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
    </div>
  );
};
