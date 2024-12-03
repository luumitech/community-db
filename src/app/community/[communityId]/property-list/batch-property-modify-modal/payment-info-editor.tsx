import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectSection } from '~/view/base/select';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const PaymentInfoEditor: React.FC<Props> = ({ className }) => {
  const { selectPaymentMethodSections } = useAppContext();
  const { watch } = useHookFormContext();
  const memberYear = watch('membership.year');

  return (
    <div className={clsx(className)}>
      <Select
        className="max-w-sm"
        controlName="membership.paymentMethod"
        label="Payment Method"
        items={selectPaymentMethodSections}
        placeholder="Select a payment method"
        selectionMode="single"
        description={`This field will be used only if the property does not have existing membership in year ${memberYear}`}
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
