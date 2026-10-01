import { cn } from '@heroui/react';
import React from 'react';
import { type RevenueStat } from '../_type';
import { RevenueGridTable, type ColumnKey } from './revenue-grid-table';
import { useRevenueTable } from './use-revenue-table';

export interface Props {
  className?: string;
  revenueStat: RevenueStat;
  isLoading?: boolean;
  groupBy: string;
}

export const RevenueTable: React.FC<Props> = ({
  className,
  revenueStat,
  isLoading,
  groupBy,
}) => {
  const { statWithId, doSort, sortDescriptor } = useRevenueTable(
    revenueStat,
    groupBy
  );

  const columnKeys = React.useMemo<ColumnKey[]>(() => {
    switch (groupBy) {
      case 'itemName':
        return ['itemName', 'count', 'price'];

      case 'paymentMethod':
        return ['paymentMethod', 'count', 'price'];

      case 'none':
      default:
        return ['itemName', 'count', 'price', 'paymentMethod'];
    }
  }, [groupBy]);

  return (
    <RevenueGridTable
      // This is applied to the grid container
      className={cn(
        'overflow-y-auto',
        groupBy === 'none'
          ? 'grid-cols-[auto_repeat(2,min-content)_auto]'
          : 'grid-cols-[auto_repeat(2,min-content)]'
      )}
      items={statWithId}
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
