import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useUserInfo } from '~/custom-hooks/user-info';

interface Props {
  className?: string;
}

export const UserInfo: React.FC<Props> = ({ className }) => {
  const { fullName, email } = useUserInfo();

  return (
    <div
      className={twMerge(
        'grid grid-cols-[auto_1fr]',
        'items-center gap-2',
        className
      )}
    >
      <span className="text-sm font-semibold">Name</span>
      <span>{fullName}</span>
      <span className="text-sm font-semibold">Email</span>
      <span>{email}</span>
    </div>
  );
};
