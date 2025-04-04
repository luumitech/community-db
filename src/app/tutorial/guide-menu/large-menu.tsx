import { cn } from '@heroui/react';
import React from 'react';
import { MenuOptions } from './menu-options';

interface Props {
  className?: string;
}

export const LargeMenu: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'max-w-xs')}>
      <MenuOptions />
    </div>
  );
};
