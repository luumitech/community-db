import clsx from 'clsx';
import React from 'react';
import { FragmentType } from '~/graphql/generated';
import { toLocalDateTime } from '~/lib/date-util';
import { UserFragment, UserName } from './user-name';

interface Props {
  className?: string;
  updatedAt: string;
  user?: FragmentType<typeof UserFragment> | null;
}

export const LastModified: React.FC<Props> = ({
  className,
  updatedAt,
  user,
}) => {
  const updatedAtStr = toLocalDateTime(updatedAt);

  return (
    <div className={clsx(className, 'text-xs')}>
      Last modified on {updatedAtStr} by <UserName user={user} />
    </div>
  );
};
