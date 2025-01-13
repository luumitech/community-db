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
  yearIdx: number;
  eventIdx?: number;
  ticketIdx?: number;
}

export const PaymentSelect: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
  ticketIdx,
}) => {
  const { selectPaymentMethodSections } = useAppContext();
  const { clearErrors } = useHookFormContext();

  const onSelectionChange: NonNullable<SelectProps['onSelectionChange']> =
    React.useCallback(
      (keys) => {
        clearErrors(`membershipList.${yearIdx}.eventAttendedList`);
      },
      [clearErrors, yearIdx]
    );

  const controlName =
    eventIdx == null || ticketIdx == null
      ? `membershipList.${yearIdx}.paymentMethod`
      : `membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticketList.${ticketIdx}.paymentMethod`;

  return (
    <div className={clsx(className)}>
      <Select
        className="max-w-sm"
        controlName={controlName}
        aria-label="Payment Method"
        items={selectPaymentMethodSections}
        variant="underlined"
        // placeholder="Select a payment method"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
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
