import React from 'react';
import { twMerge } from 'tailwind-merge';
import { MenuOptions } from './menu-options';

interface Props {
  className?: string;
}

export const LargeMenu: React.FC<Props> = ({ className }) => {
  return (
    <div className={twMerge('max-w-xs', className)}>
      <MenuOptions />
    </div>
  );
};
