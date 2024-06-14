import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

export const UserFragment = graphql(/* GraphQL */ `
  fragment User on User {
    id
    name
    email
  }
`);

interface Props {
  className?: string;
  user?: FragmentType<typeof UserFragment> | null;
}

export const UserName: React.FC<Props> = (props) => {
  const user = useFragment(UserFragment, props.user);
  const displayName = user?.name?.split(' ')?.[0] ?? user?.email ?? 'n/a';

  return <span className={props.className}>{displayName}</span>;
};
