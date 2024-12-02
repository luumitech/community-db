import { Select, SelectItem, SelectSection } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const PaymentInfoEditor: React.FC<Props> = ({ className }) => {
  const { selectPaymentMethodSections } = useAppContext();
  const { register, formState, watch } = useHookFormContext();
  const { errors } = formState;
  const memberYear = watch('membership.year');

  const error = errors.membership?.paymentMethod?.message;

  return (
    <div className={clsx(className)}>
      <Select
        className={'max-w-sm'}
        label="Payment Method"
        items={selectPaymentMethodSections}
        placeholder="Select a payment method"
        errorMessage={error}
        isInvalid={!!error}
        selectionMode="single"
        isRequired
        description={`This field will be used only if the property does not have existing membership in year ${memberYear}`}
        {...register('membership.paymentMethod')}
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
