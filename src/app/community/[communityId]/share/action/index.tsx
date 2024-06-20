import clsx from 'clsx';
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
    <div className={clsx(className, 'flex gap-2')}>
      <ModifyAccessButton fragment={fragment} />
      <RemoveAccess fragment={fragment} />
    </div>
  );
};
