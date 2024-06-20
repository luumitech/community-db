import { Input } from '@nextui-org/react';
import React from 'react';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const EmailEditor: React.FC<Props> = ({ className }) => {
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <Input
      className={className}
      label="Email"
      placeholder="Enter email"
      errorMessage={errors.email?.message}
      isInvalid={!!errors.email?.message}
      {...register('email')}
    />
  );
};
