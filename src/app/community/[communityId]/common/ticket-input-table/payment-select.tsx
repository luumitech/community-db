import { cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  Select,
  SelectItem,
  SelectSection,
  type SelectProps,
} from '~/view/base/select';

type CustomSelectProps = Omit<
  SelectProps,
  'controlName' | 'items' | 'children'
>;

interface Props extends CustomSelectProps {
  className?: string;
  controlNamePrefix: string;
  includeHiddenFields?: boolean;
}

export const PaymentSelect: React.FC<Props> = ({
  className,
  controlNamePrefix,
  includeHiddenFields,
  ...props
}) => {
  const { selectPaymentMethodSections, visiblePaymentMethods } =
    useAppContext();

  const items = includeHiddenFields
    ? selectPaymentMethodSections
    : [{ title: '', items: visiblePaymentMethods, showDivider: false }];

  return (
    <div className={cn(className)}>
      <Select
        className="min-w-32 max-w-xs"
        controlName={`${controlNamePrefix}.paymentMethod`}
        // This is being controlled by the transaction total payment select
        isControlled
        aria-label="Payment Method"
        items={items}
        variant="underlined"
        selectionMode="single"
        {...props}
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
