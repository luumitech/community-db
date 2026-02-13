import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { RoleItem } from './role-item';

interface Props {
  className?: string;
  role: GQL.Role;
}

export const RoleDescription: React.FC<Props> = ({ className, role }) => {
  return (
    <div className="flex flex-col gap-2">
      {role === GQL.Role.Viewer ? (
        <RoleItem role="Viewer">
          <span>Can view all community and property information</span>
          <span>Cannot make changes</span>
        </RoleItem>
      ) : role === GQL.Role.Editor ? (
        <RoleItem role="Editor">
          <span>Can view all information</span>
          <span>Can update community and property details</span>
        </RoleItem>
      ) : (
        <RoleItem role="Admin">
          <span>Full access to manage the system</span>
          <span>Update community and property details</span>
          <span>Add or remove user access</span>
          <span>Import data into a community</span>
          <span>Create or delete properties</span>
          <span>Delete community</span>
        </RoleItem>
      )}
    </div>
  );
};
