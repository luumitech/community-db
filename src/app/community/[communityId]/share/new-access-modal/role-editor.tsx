import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Select, SelectItem } from '~/view/base/select';

interface Props {
  className?: string;
}

export const RoleEditor: React.FC<Props> = ({ className }) => {
  const { roleItems } = useAppContext();

  return (
    <Select
      controlName="role"
      label="Role"
      items={roleItems}
      placeholder="Select a role"
      disallowEmptySelection
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
