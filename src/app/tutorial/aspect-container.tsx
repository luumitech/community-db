import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
}

export const AspectContainer: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div className={cn(className, 'w-full min-w-[480px]')}>
      <div
        className={cn(
          // Create 4:5 aspect ratio container
          'relative h-0 pb-[calc(4/5*100%)]',
          'rounded-xl bg-slate-700'
        )}
      >
        <div className="absolute w-full h-full">
          <div className="p-2 h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
