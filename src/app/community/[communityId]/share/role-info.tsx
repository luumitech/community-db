import { cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type AccessEntry } from './_type';

const RoleFragment = graphql(/* GraphQL */ `
  fragment AccessList_Role on Access {
    role
  }
`);

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const RoleInfo: React.FC<Props> = ({ className, fragment }) => {
  const entry = getFragment(RoleFragment, fragment);

  return (
    <div className={cn(className, 'truncate capitalize')}>
      {entry.role.toLocaleLowerCase() ?? ''}
    </div>
  );
};
