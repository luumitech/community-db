import { Input } from '@nextui-org/react';
import React from 'react';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const AddressEditor: React.FC<Props> = ({ className }) => {
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <>
      <Input
        className={className}
        variant="bordered"
        label="Address"
        placeholder="Address"
        errorMessage={errors.address?.message}
        isInvalid={!!errors.address?.message}
        {...register('address')}
      />
      <Input
        className={className}
        variant="bordered"
        label="Street Number"
        placeholder="Street Number"
        errorMessage={errors.streetNo?.message}
        isInvalid={!!errors.streetNo?.message}
        {...register('streetNo')}
      />
      <Input
        className={className}
        variant="bordered"
        label="Street Name"
        placeholder="Street Name"
        errorMessage={errors.streetName?.message}
        isInvalid={!!errors.streetName?.message}
        {...register('streetName')}
      />
      <Input
        className={className}
        variant="bordered"
        label="Postal Code"
        placeholder="Postal Code"
        errorMessage={errors.postalCode?.message}
        isInvalid={!!errors.postalCode?.message}
        {...register('postalCode')}
      />
    </>
  );
};
