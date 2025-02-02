import { ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { EventRow, EventRowHeader } from './event-row';

interface Props {
  className?: string;
}

export const EventInfoEditor: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className)}>
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className={clsx('grid grid-cols-[repeat(2,1fr)_80px]', 'gap-2')}>
          <EventRowHeader />
          <EventRow />
        </div>
      </ScrollShadow>
    </div>
  );
};
