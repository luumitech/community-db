'use client';
import { Button, Input } from '@nextui-org/react';
import React from 'react';
import { useFieldArray, useHookFormContext } from './use-hook-form';

interface Props {}

export const OccupantEditor: React.FC<Props> = () => {
  const { control, register, formState } = useHookFormContext();
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'occupantList',
  });

  return (
    <div>
      {fields.map((field, idx) => (
        <Input
          key={field.id}
          label="First Name"
          errorMessage={errors.occupantList?.[idx]?.firstName?.message}
          isInvalid={!!errors.occupantList?.[idx]?.firstName?.message}
          {...register(`occupantList.${idx}.firstName`)}
        />
      ))}
    </div>
  );
};
