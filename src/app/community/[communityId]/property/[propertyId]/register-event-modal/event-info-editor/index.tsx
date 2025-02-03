import { ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import { EventRow, EventRowHeader } from './event-row';

interface Props {
  className?: string;
}

export const EventInfoEditor: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className={cn('grid grid-cols-[repeat(2,1fr)_80px]', 'gap-2')}>
          <EventRowHeader />
          <EventRow />
        </div>
      </ScrollShadow>
    </div>
  );
};
