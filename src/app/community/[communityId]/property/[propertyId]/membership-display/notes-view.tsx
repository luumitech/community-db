import { ScrollShadow } from '@nextui-org/scroll-shadow';
import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  notes?: string | null;
}

export const NotesView: React.FC<Props> = ({ className, notes }) => {
  return (
    <div className={clsx(className)}>
      <p className="text-foreground-500 text-xs">Notes</p>
      <ScrollShadow className="h-28">
        <span className="whitespace-pre-wrap text-sm">{notes ?? ''}</span>
      </ScrollShadow>
    </div>
  );
};
