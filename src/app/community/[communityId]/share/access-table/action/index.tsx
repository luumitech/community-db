import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { AccessEntry } from '../../_type';
import { ModifyAccessButton } from './modify-access-button';
import { RemoveAccess } from './remove-access';

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const Action: React.FC<Props> = ({ className, fragment }) => {
  return (
    <div className={twMerge('flex gap-2', className)}>
      <ModifyAccessButton fragment={fragment} />
      <RemoveAccess fragment={fragment} />
    </div>
  );
};
