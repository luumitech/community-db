import { cn } from '@heroui/react';
import React from 'react';

interface Props {
  className?: string;
}

export const Instruction: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn('text-xs font-normal text-default-400', className)}>
      To designate a household as the current occupant, drag and drop it to the
      top of the list.
    </div>
  );
};
