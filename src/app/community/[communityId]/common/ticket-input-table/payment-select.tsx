import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem, SelectSection } from '~/view/base/select';

interface Props {
  className?: string;
  controlNamePrefix: string;
  includeHiddenFields?: boolean;
}

export const PaymentSelect: React.FC<Props> = ({
  className,
  controlNamePrefix,
  includeHiddenFields,
}) => {
  const { selectPaymentMethodSections, visiblePaymentMethods } =
    useAppContext();

  const items = includeHiddenFields
    ? selectPaymentMethodSections
    : [{ title: '', items: visiblePaymentMethods, showDivider: false }];

  return (
    <div className={clsx(className)}>
      <Select
        className="min-w-32 max-w-xs"
        controlName={`${controlNamePrefix}.paymentMethod`}
        aria-label="Payment Method"
        items={items}
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
    </div>
  );
};
