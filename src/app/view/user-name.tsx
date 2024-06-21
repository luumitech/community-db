import React from 'react';
import { graphql, useFragment } from '~/graphql/generated';
import { type UserFragmentType } from './_type';

export const UserFragment = graphql(/* GraphQL */ `
  fragment User on User {
    id
    name
    email
  }
`);

interface Props {
  className?: string;
  userFragment?: UserFragmentType | null;
}

export const UserName: React.FC<Props> = ({ className, userFragment }) => {
  const user = useFragment(UserFragment, userFragment);
  const displayName = user?.name?.split(' ')?.[0] ?? user?.email ?? 'n/a';

  return <span className={className}>{displayName}</span>;
};
