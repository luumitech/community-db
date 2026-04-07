import { Divider, ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import * as R from 'remeda';
import { lsFlags } from '~/lib/env';
import { type TicketStat } from '../_type';
import { GroupBy } from './group-by';
import { TableHeader, TableRow, TableSumRow } from './table-row';

export interface Props {
  className?: string;
  ticketList: TicketStat;
}

export const TicketTable: React.FC<Props> = ({ className, ticketList }) => {
  const [groupBy = 'none', setGroupBy] = useLocalStorage(
    lsFlags.dashboardByTicketGroupBy,
    'none'
  );

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <GroupBy defaultValue={groupBy} onValueChange={setGroupBy} />
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className="grid grid-cols-[repeat(5,max-content)] gap-x-6 gap-y-2">
          <TableHeader />
          {groupBy === 'none' &&
            ticketList.map((ticket) => (
              <TableRow key={ticket.key} ticket={ticket} />
            ))}
          {groupBy === 'eventName' &&
            Object.entries(R.groupBy(ticketList, R.prop('eventName'))).map(
              ([eventName, tickets]) => {
                return (
                  <TableSumRow
                    key={eventName}
                    ticketList={tickets}
                    eventName={eventName}
                  />
                );
              }
            )}
          {groupBy === 'ticketName' &&
            Object.entries(R.groupBy(ticketList, R.prop('ticketName'))).map(
              ([ticketName, tickets]) => {
                return (
                  <TableSumRow
                    key={ticketName}
                    ticketList={tickets}
                    ticketName={ticketName}
                  />
                );
              }
            )}
          {groupBy === 'paymentMethod' &&
            Object.entries(R.groupBy(ticketList, R.prop('paymentMethod'))).map(
              ([paymentMethod, tickets]) => {
                return (
                  <TableSumRow
                    key={paymentMethod}
                    ticketList={tickets}
                    paymentMethod={paymentMethod}
                  />
                );
              }
            )}
          <div className="col-span-full">
            <Divider />
          </div>
          <TableSumRow ticketList={ticketList} />
        </div>
      </ScrollShadow>
    </div>
  );
};
