import React from 'react';
import { twMerge } from 'tailwind-merge';
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
    <div className={twMerge('truncate capitalize', className)}>
      {entry.role.toLocaleLowerCase() ?? ''}
    </div>
  );
};
