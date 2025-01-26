import clsx from 'clsx';
import React from 'react';
import { EventRow, EventRowHeader } from './event-row';

interface Props {
  className?: string;
}

export const EventInfoEditor: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className, 'flex flex-col gap-2')}>
      <div
        className={clsx(
          'grid grid-cols-[repeat(4,1fr)_80px]',
          'gap-2 overflow-x-auto overflow-y-hidden'
        )}
      >
        <EventRowHeader />
        <EventRow />
      </div>
    </div>
  );
};
