import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

export const AspectContainer: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div className={twMerge('w-full min-w-[480px]', className)}>
      <div
        className={cn(
          // Create 4:5 aspect ratio container
          'relative h-0 pb-[calc(4/5*100%)]',
          'rounded-xl bg-slate-700'
        )}
      >
        <div className="absolute h-full w-full">
          <div className="h-full p-2">{children}</div>
        </div>
      </div>
    </div>
  );
};
