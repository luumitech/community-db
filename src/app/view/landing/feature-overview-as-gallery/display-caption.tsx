import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
  caption?: string | null;
}

/** Display caption at the bottom of container */
export const DisplayCaption: React.FC<Props> = ({ className, caption }) => {
  if (!caption) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute bottom-0 w-full',
        'flex items-center justify-center',
        'bg-foreground/60 backdrop-blur-md'
      )}
    >
      <span
        className={twMerge(
          'text-center text-xl font-bold text-background',
          'p-3',
          className
        )}
      >
        {caption}
      </span>
    </div>
  );
};
