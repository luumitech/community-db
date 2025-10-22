import { cn } from '@heroui/react';
import React from 'react';
import { useUserInfo } from '~/custom-hooks/user-info';

interface Props {
  className?: string;
}

export const UserInfo: React.FC<Props> = ({ className }) => {
  const { fullName, email } = useUserInfo();

  return (
    <div
      className={cn(
        'grid grid-cols-[auto_1fr]',
        'gap-2 items-center',
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
