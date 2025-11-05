import { Chip, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type AccessEntry } from './_type';

export const UserInfoFragment = graphql(/* GraphQL */ `
  fragment AccessList_User on Access {
    user {
      email
    }
  }
`);

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const UserInfo: React.FC<Props> = ({ className, fragment }) => {
  const entry = getFragment(UserInfoFragment, fragment);
  return (
    <div className={cn(className, 'flex items-center gap-1 truncate')}>
      <span>{entry.user.email ?? ''}</span>
      {!!fragment.isSelf && (
        <Chip radius="sm" size="sm" variant="bordered" color="primary">
          you
        </Chip>
      )}
      {!!fragment.isOwner && (
        <Chip radius="sm" size="sm" variant="flat" color="secondary">
          owner
        </Chip>
      )}
    </div>
  );
};
