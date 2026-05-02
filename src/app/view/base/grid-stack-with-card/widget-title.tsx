import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

export const WidgetTitle: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <span className={twMerge('text-sm font-semibold', className)}>
      {children}
    </span>
  );
};
