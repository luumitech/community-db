import { Select, SelectItem } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const RoleEditor: React.FC<Props> = ({ className }) => {
  const { roleItems } = useAppContext();
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <Select
      label="Role"
      items={roleItems}
      disallowEmptySelection
      placeholder="Select a role"
      errorMessage={errors.role?.message}
      isInvalid={!!errors.role?.message}
      {...register('role')}
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
