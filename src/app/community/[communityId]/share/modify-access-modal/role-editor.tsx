import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { Select, SelectItem } from '~/view/base/select';

interface Props {
  className?: string;
}

export const RoleEditor: React.FC<Props> = ({ className }) => {
  const { roleItems } = useLayoutContext();

  return (
    <Select
      controlName="role"
      label="Role"
      items={roleItems}
      disallowEmptySelection
      placeholder="Select a role"
    >
      {(item) => (
        <SelectItem key={item.value} textValue={item.label}>
          {item.label}
        </SelectItem>
      )}
    </Select>
  );
};
