import { Select, SelectItem } from '@nextui-org/select';
import clsx from 'clsx';
import React from 'react';
import { Controller } from '~/custom-hooks/hook-form';
import { useHookFormContext } from './use-hook-form';

const supportedPaymentType = [
  'cash',
  'cheque',
  'paypal',
  'e-Transfer',
  'free',
].map((entry) => ({ label: entry, value: entry }));

interface Props {
  className?: string;
  yearIdx: number;
}

export const PaymentInfoEditor: React.FC<Props> = ({ className, yearIdx }) => {
  const { control, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <div className={clsx(className)}>
      <Controller
        control={control}
        name={`membershipList.${yearIdx}.paymentMethod`}
        render={({ field }) => (
          <Select
            className={'max-w-sm'}
            label="Payment Method"
            items={supportedPaymentType}
            placeholder="Select a payment method"
            errorMessage={
              errors.membershipList?.[yearIdx]?.paymentMethod?.message
            }
            isInvalid={
              !!errors.membershipList?.[yearIdx]?.paymentMethod?.message
            }
            selectedKeys={field.value ? [field.value] : []}
            selectionMode="single"
            onChange={field.onChange}
          >
            {(entry) => (
              <SelectItem key={entry.value} textValue={entry.label}>
                {entry.label}
              </SelectItem>
            )}
          </Select>
        )}
      />
    </div>
  );
};
