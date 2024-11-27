import { Select, SelectItem, SelectSection } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Controller } from '~/custom-hooks/hook-form';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const PaymentInfoEditor: React.FC<Props> = ({ className }) => {
  const { selectPaymentMethodSections } = useAppContext();
  const { control, formState } = useHookFormContext();
  const { errors } = formState;

  const error = errors.membership?.paymentMethod?.message;

  return (
    <div className={clsx(className)}>
      <Controller
        control={control}
        name="membership.paymentMethod"
        render={({ field }) => (
          <Select
            className={'max-w-sm'}
            label="Payment Method"
            items={selectPaymentMethodSections}
            placeholder="Select a payment method"
            errorMessage={error}
            isInvalid={!!error}
            selectedKeys={field.value ? [field.value] : []}
            selectionMode="single"
            onChange={field.onChange}
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
        )}
      />
    </div>
  );
};
