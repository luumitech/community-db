import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { AccessEntry, CommunityEntry } from '../../_type';
import { ModifyAccessButton } from './modify-access-button';
import { ModifyOwnershipButton } from './modify-ownership-button';
import { RemoveAccess } from './remove-access';

interface Props {
  className?: string;
  community: CommunityEntry;
  fragment: AccessEntry;
}

export const Action: React.FC<Props> = ({ className, community, fragment }) => {
  return (
    <div className={twMerge('flex gap-2', className)}>
      {fragment.isOwner && <ModifyOwnershipButton community={community} />}
      <ModifyAccessButton fragment={fragment} />
      <RemoveAccess fragment={fragment} />
    </div>
  );
};
