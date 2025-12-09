import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
}

export const ListItem: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <li className={twMerge('flex items-center gap-2', className)}>
      <Icon className="text-green-600" icon="checkmark" />
      {children}
    </li>
  );
};
