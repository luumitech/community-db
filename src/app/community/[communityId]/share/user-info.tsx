import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { type AccessEntry } from './_type';

export const UserInfoFragment = graphql(/* GraphQL */ `
  fragment AccessList_User on Access {
    user {
      email
    }
  }
`);

export type UserInfoFragmentType = FragmentType<typeof UserInfoFragment>;

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const UserInfo: React.FC<Props> = ({ className, fragment }) => {
  const entry = useFragment(UserInfoFragment, fragment);
  return (
    <div className={clsx(className, 'flex truncate gap-1')}>
      <span>{entry.user.email ?? ''}</span>
      {!!fragment.isSelf && <span>(you)</span>}
    </div>
  );
};
