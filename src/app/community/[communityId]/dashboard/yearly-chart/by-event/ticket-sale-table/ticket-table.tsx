import { CardBody, Divider, ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useLocalStorage } from 'usehooks-ts';
import { lsFlags } from '~/lib/env-var';
import { type TicketStat } from '../_type';
import { GroupBy } from './group-by';
import { TableHeader, TableRow, TableSumRow } from './table-row';

export interface Props {
  className?: string;
  ticketList: TicketStat;
}

export const TicketTable: React.FC<Props> = ({ className, ticketList }) => {
  const [groupBy, setGroupBy] = useLocalStorage(
    lsFlags.dashboardEventTicketSaleGroupBy,
    'none'
  );

  return (
    <CardBody className={cn(className, 'gap-2')}>
      <GroupBy defaultValue={groupBy} onValueChange={setGroupBy} />
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className="grid grid-cols-[repeat(5,max-content)] gap-x-6 gap-y-2">
          <TableHeader />
          {groupBy === 'none' &&
            ticketList.map((ticket) => (
              <TableRow key={ticket.key} ticket={ticket} />
            ))}
          {groupBy === 'membershipYear' &&
            Object.entries(R.groupBy(ticketList, R.prop('membershipYear'))).map(
              ([yearStr, tickets]) => {
                return (
                  <TableSumRow
                    key={yearStr}
                    ticketList={tickets}
                    membershipYear={parseInt(yearStr, 10)}
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
    </CardBody>
  );
};
