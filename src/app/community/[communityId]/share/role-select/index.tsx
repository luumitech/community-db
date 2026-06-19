import { cn } from '@heroui/react';
import React from 'react';
import * as GQL from '~/graphql/generated/types';
import { SelectProps, createSelect, type SelectItem } from '~/view/base/select';
import { type InputData } from '../modify-access-modal/use-hook-form';

const Select = createSelect<InputData>();

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

export const roleItems: SelectItem[] = [
  {
    key: GQL.Role.Admin,
    textValue: 'Admin',
    description:
      'Full access, including managing users, importing data, and creating or deleting communities and properties',
  },
  {
    key: GQL.Role.Editor,
    textValue: 'Editor',
    description: 'Can view and edit community and property information',
  },
  {
    key: GQL.Role.Viewer,
    textValue: 'Viewer',
    description: 'View-only access to communities and properties',
  },
].map((item) => ({
  ...item,
  props: {
    classNames: {
      // Reverse the default 'truncate' for description
      description: cn('overflow-visible text-clip whitespace-normal'),
    },
  },
}));

type CustomProps = Omit<SelectProps, 'items'>;

interface Props extends CustomProps {
  className?: string;
  controlName: `role`;
}

export const RoleSelect: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Select
      label="Role"
      items={roleItems}
      disallowEmptySelection
      placeholder="Select a role"
      {...props}
    />
  );
};
