import { Input } from '@nextui-org/react';
import React from 'react';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const NameEditor: React.FC<Props> = ({ className }) => {
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <Input
      className={className}
      variant="bordered"
      label="Name"
      placeholder="Enter community name"
      errorMessage={errors.name?.message}
      isInvalid={!!errors.name?.message}
      {...register('name')}
    />
  );
};
