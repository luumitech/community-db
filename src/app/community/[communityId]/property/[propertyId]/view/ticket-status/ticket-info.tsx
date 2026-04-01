import { cn } from '@heroui/react';
import React from 'react';
import type { TicketEntry } from './_type';

interface Props {
  className?: string;
  ticketList?: TicketEntry[];
}

export const TicketInfo: React.FC<Props> = ({ className, ticketList }) => {
  return (
    <div className={cn(className)}>
      <pre>{JSON.stringify(ticketList, null, 2)}</pre>
    </div>
  );
};
