import { Button, Input, Textarea } from '@nextui-org/react';
import React from 'react';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const InfoEditor: React.FC<Props> = ({ className }) => {
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <Textarea
      className={className}
      variant="bordered"
      label="Notes"
      placeholder="Enter notes"
      errorMessage={errors.notes?.message}
      isInvalid={!!errors.notes?.message}
      {...register('notes')}
    />
  );
};
