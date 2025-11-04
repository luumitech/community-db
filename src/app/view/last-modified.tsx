import React from 'react';
import { twMerge } from 'tailwind-merge';
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
    <div className={twMerge('text-xs text-foreground-500', className)}>
      Last modified on {updatedAtStr} by <UserName userFragment={updatedBy} />
    </div>
  );
};
