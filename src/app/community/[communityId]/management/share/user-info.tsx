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
  isSelf?: boolean;
}

export const UserInfo: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);

  return (
    <div className={clsx(props.className, 'flex truncate gap-1')}>
      <span>{entry.user.email ?? ''}</span>
      {!!props.isSelf && <span>(you)</span>}
    </div>
  );
};
