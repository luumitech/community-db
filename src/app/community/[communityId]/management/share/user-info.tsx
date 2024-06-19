import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const EntryFragment = graphql(/* GraphQL */ `
  fragment AccessList_User on Access {
    user {
      email
    }
  }
`);

export type UserInfoFragmentType = FragmentType<typeof EntryFragment>;

interface Props {
  className?: string;
  entry: UserInfoFragmentType;
}

export const UserInfo: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);

  return (
    <div className={clsx(props.className, 'truncate')}>
      {entry.user.email ?? ''}
    </div>
  );
};
