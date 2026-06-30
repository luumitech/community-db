import { cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type AccessEntry } from '../_type';
import { OwnerChip } from '../owner-chip';
import { YouChip } from '../you-chip';

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
    <div className={cn(className, 'flex flex-wrap items-center gap-1')}>
      <span className="truncate">{entry.user.email ?? ''}</span>
      {!!fragment.isSelf && <YouChip />}
      {!!fragment.isOwner && <OwnerChip />}
    </div>
  );
};
