'use client';
import { Button, Input, Textarea } from '@nextui-org/react';
import React from 'react';
import { useHookFormContext } from './use-hook-form';

interface Props {}

export const InfoEditor: React.FC<Props> = () => {
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <div>
      <Textarea
        label="Notes"
        placeholder="Enter notes"
        errorMessage={errors.notes?.message}
        isInvalid={!!errors.notes?.message}
        {...register('notes')}
      />
    </div>
  );
};
