import { Select, SelectItem } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { useHookFormContext } from './use-hook-form';

interface RoleSelectItem {
  label: string;
  value: GQL.Role;
}
const roleSelectionList: RoleSelectItem[] = [
  { label: 'Admin', value: GQL.Role.Admin },
  { label: 'Editor', value: GQL.Role.Editor },
  { label: 'Viewer', value: GQL.Role.Viewer },
];

interface Props {
  className?: string;
}

export const RoleEditor: React.FC<Props> = ({ className }) => {
  const { register, formState } = useHookFormContext();
  const { errors } = formState;

  return (
    <Select
      label="Role"
      items={roleSelectionList}
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
