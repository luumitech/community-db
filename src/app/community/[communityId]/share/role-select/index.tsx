import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem, SelectProps } from '~/view/base/select';

/**
 * Status items and corresponding labels for GQL.Role
 *
 * - Used for SelectItem component
 */
export interface RoleStatusItem {
  key: GQL.Role;
  label: string;
  desc: string;
}

export const roleItems: RoleStatusItem[] = [
  {
    key: GQL.Role.Admin,
    label: 'Admin',
    desc: 'Full access, including managing users, importing data, and creating or deleting communities and properties',
  },
  {
    key: GQL.Role.Editor,
    label: 'Editor',
    desc: 'Can view and edit community and property information',
  },
  {
    key: GQL.Role.Viewer,
    label: 'Viewer',
    desc: 'View-only access to communities and properties',
  },
];

type CustomProps = Omit<SelectProps<RoleStatusItem>, 'children'>;

interface Props extends CustomProps {
  className?: string;
}

export const RoleSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Select
      label="Role"
      items={roleItems}
      disallowEmptySelection
      placeholder="Select a role"
      {...props}
    >
      {(item) => (
        <SelectItem key={item.key} textValue={item.label}>
          <div className="flex flex-col">
            <span className="text-small">{item.label}</span>
            <span className="text-tiny text-default-400">{item.desc}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  );
};
