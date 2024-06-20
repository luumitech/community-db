import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const EntryFragment = graphql(/* GraphQL */ `
  fragment AccessList_Role on Access {
    role
  }
`);

export type RoleInfoFragmentType = FragmentType<typeof EntryFragment>;

interface Props {
  className?: string;
  entry: RoleInfoFragmentType;
}

export const RoleInfo: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);

  return (
    <div className={clsx(props.className, 'truncate capitalize')}>
      {entry.role.toLocaleLowerCase() ?? ''}
    </div>
  );
};
