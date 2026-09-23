import { cn } from '@heroui/react';
import React from 'react';
import { type TicketStat } from './_type';
import { TicketGridTable, type ColumnKey } from './ticket-grid-table';
import { useTicketList } from './use-ticket-list';

export interface Props {
  className?: string;
  ticketStat: TicketStat;
  isLoading?: boolean;
  groupBy: string;
}

export const TicketTable: React.FC<Props> = ({
  className,
  ticketStat,
  isLoading,
  groupBy,
}) => {
  const { ticketStatWithId, doSort, sortDescriptor } = useTicketList(
    ticketStat,
    groupBy
  );

  const columnKeys = React.useMemo<ColumnKey[]>(() => {
    switch (groupBy) {
      case 'eventName':
        return ['eventName', 'count', 'price'];

      case 'paymentMethod':
        return ['paymentMethod', 'count', 'price'];

      case 'none':
      default:
        return ['eventName', 'count', 'price', 'paymentMethod'];
    }
  }, [groupBy]);

  return (
    <TicketGridTable
      // This is applied to the grid container
      className={cn(
        'overflow-y-auto',
        groupBy === 'none'
          ? 'grid-cols-[auto_repeat(2,min-content)_auto]'
          : 'grid-cols-[auto_repeat(2,min-content)]'
      )}
      items={ticketStatWithId}
      isLoading={isLoading}
      columnKeys={columnKeys}
      columnConfig={{
        // membershipYear: cn('font-semibold sm:font-normal'),
        // eventName: cn('font-semibold sm:font-normal'),
        count: cn('pr-2.5'),
        price: cn('pr-2.5'),
        // paymentMethod: cn('font-semibold sm:font-normal'),
      }}
      sortDescriptor={sortDescriptor}
      onSortChange={doSort}
    />
  );
};
