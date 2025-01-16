import clsx from 'clsx';
import React from 'react';
import { toLocalDateTime } from '~/lib/date-util';
import { type UserFragmentType } from './_type';
import { UserName } from './user-name';

interface Props {
  className?: string;
  updatedAt: string;
  updatedBy?: UserFragmentType | null;
}

export const LastModified: React.FC<Props> = ({
  className,
  updatedAt,
  updatedBy,
}) => {
  const updatedAtStr = toLocalDateTime(updatedAt);

  return (
    <div className={clsx(className, 'text-xs text-foreground-500')}>
      Last modified on {updatedAtStr} by <UserName userFragment={updatedBy} />
    </div>
  );
};
