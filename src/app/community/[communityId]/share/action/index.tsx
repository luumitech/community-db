import { cn } from '@heroui/react';
import React from 'react';
import { type AccessEntry } from '../_type';
import { ModifyAccessButton } from './modify-access-button';
import { RemoveAccess } from './remove-access';

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const Action: React.FC<Props> = ({ className, fragment }) => {
  return (
    <div className={cn(className, 'flex gap-2')}>
      <ModifyAccessButton fragment={fragment} />
      <RemoveAccess fragment={fragment} />
    </div>
  );
};
