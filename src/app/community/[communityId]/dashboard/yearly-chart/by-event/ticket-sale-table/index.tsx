import { cn } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { Card } from '~/view/base/card';
import { type TicketStat } from '../_type';
import { GroupBy } from './group-by';
import { TicketTable } from './ticket-table';

export interface Props {
  className?: string;
  ticketList: TicketStat;
  isLoading?: boolean;
}

export const TicketSaleTable: React.FC<Props> = ({
  className,
  ticketList,
  isLoading,
}) => {
  const [groupBy = 'none', setGroupBy] = useLocalStorage(
    lsFlags.dashboardEventTicketSaleGroupBy,
    'none'
  );

  return (
    <Card className={cn(className)} shadow="sm">
      <Card.Header className="font-semibold">Ticket Sale</Card.Header>
      <Card.Body className="gap-2">
        <GroupBy
          defaultValue={groupBy}
          onValueChange={setGroupBy}
          isDisabled={!ticketList.length}
        />
        <TicketTable
          ticketList={ticketList}
          isLoading={isLoading}
          groupBy={groupBy}
        />
      </Card.Body>
    </Card>
  );
};
