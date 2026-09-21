import { cn } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { type TicketStat } from './_type';
import { GroupBy } from './group-by';
import { TicketGridTable, type ColumnKey } from './ticket-grid-table';
import { TicketNameSelect } from './ticket-name-select';
import { useTicketList } from './use-ticket-list';

export interface Props {
  className?: string;
  ticketStat: TicketStat;
  isLoading?: boolean;
}

export const TicketTable: React.FC<Props> = ({
  className,
  ticketStat,
  isLoading,
}) => {
  const [groupBy = 'none', setGroupBy] = useLocalStorage(
    lsFlags.dashboardByTicketGroupBy,
    'none'
  );
  const ticketNameList = React.useMemo(() => {
    const result = new Set<string>();
    ticketStat.forEach(({ ticketName }) => result.add(ticketName));
    return [...result];
  }, [ticketStat]);

  const { ticketStatWithId, ticketSelected, doSort, sortDescriptor } =
    useTicketList(ticketStat, groupBy);

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
    <div className={cn(className, 'flex flex-col gap-2')}>
      <TicketNameSelect ticketNameList={ticketNameList} />
      <GroupBy
        isDisabled={!ticketNameList.includes(ticketSelected)}
        defaultValue={groupBy}
        onValueChange={setGroupBy}
      />
      <div className="overflow-y-auto">
        <TicketGridTable
          // This is applied to the grid container
          className={
            groupBy === 'none'
              ? 'grid-cols-[auto_repeat(2,min-content)_auto]'
              : 'grid-cols-[auto_repeat(2,min-content)]'
          }
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
      </div>
    </div>
  );
};
