import { cn } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { Card } from '~/view/base/card';
import { type RevenueStat } from '../_type';
import { GroupBy } from './group-by';
import { RevenueTable } from './revenue-table';

export interface Props {
  className?: string;
  revenueStat: RevenueStat;
  isLoading?: boolean;
}

export const TotalSales: React.FC<Props> = ({
  className,
  revenueStat,
  isLoading,
}) => {
  const [groupBy = 'none', setGroupBy] = useLocalStorage(
    lsFlags.dashboardEventTicketSaleGroupBy,
    'none'
  );

  return (
    <Card className={cn(className)} shadow="sm">
      <Card.Header className="pb-0 font-semibold">Total Sales</Card.Header>
      <Card.Body className="gap-2">
        <GroupBy
          defaultValue={groupBy}
          onValueChange={setGroupBy}
          isDisabled={!revenueStat.length}
        />
        <RevenueTable
          revenueStat={revenueStat}
          isLoading={isLoading}
          groupBy={groupBy}
        />
      </Card.Body>
    </Card>
  );
};
