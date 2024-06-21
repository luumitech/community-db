import clsx from 'clsx';
import React from 'react';
import { graphql, useFragment } from '~/graphql/generated';
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
  const entry = useFragment(RoleFragment, fragment);

  return (
    <div className={clsx(className, 'truncate capitalize')}>
      {entry.role.toLocaleLowerCase() ?? ''}
    </div>
  );
};
