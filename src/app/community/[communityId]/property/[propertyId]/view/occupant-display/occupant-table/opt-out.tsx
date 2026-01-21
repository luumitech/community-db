import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '~/view/base/icon';
import { OccupantEntry } from '../_type';

interface Props {
  className?: string;
  entry: OccupantEntry;
}

export const OptOut: React.FC<Props> = ({ className, entry }) => {
  if (!entry.optOut) {
    return null;
  }

  return (
    <div
      className={twMerge(
        'flex items-center gap-1',
        'justify-end sm:justify-start',
        className
      )}
    >
      <span
        className={cn(
          'text-tiny font-semibold text-foreground-500',
          'sm:hidden'
        )}
      >
        Opt out
      </span>
      <Icon icon="checkmark" size={18} />
    </div>
  );
};
