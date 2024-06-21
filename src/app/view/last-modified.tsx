import clsx from 'clsx';
import React from 'react';
import { toLocalDateTime } from '~/lib/date-util';
import { type UserFragmentType } from './_type';
import { UserName } from './user-name';

interface Props {
  className?: string;
  updatedAt: string;
  userFragment?: UserFragmentType | null;
}

export const LastModified: React.FC<Props> = ({
  className,
  updatedAt,
  userFragment,
}) => {
  const updatedAtStr = toLocalDateTime(updatedAt);

  return (
    <div className={clsx(className, 'text-xs')}>
      Last modified on {updatedAtStr} by{' '}
      <UserName userFragment={userFragment} />
    </div>
  );
};
