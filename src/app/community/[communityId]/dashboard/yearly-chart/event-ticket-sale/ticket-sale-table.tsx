import { Divider, ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { type TicketStat } from './_type';
import { TableHeader, TableRow, TableSumRow } from './table-row';

export interface Props {
  className?: string;
  ticketList: TicketStat[];
}

export const TicketSaleTable: React.FC<Props> = ({ className, ticketList }) => {
  const ticketByPaymentMethod = R.groupBy(ticketList, R.prop('paymentMethod'));

  return (
    <div className={clsx(className)}>
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-6 gap-y-2">
          <TableHeader />
          {ticketList.length === 0 && (
            <div
              className={clsx(
                'col-span-full h-8',
                'justify-self-center content-center'
              )}
            >
              <div className="text-sm text-foreground-500">
                No data to display
              </div>
            </div>
          )}
          {ticketList.map((ticket) => (
            <TableRow
              key={`${ticket.ticketName}-${ticket.paymentMethod}`}
              ticket={ticket}
            />
          ))}
          {ticketList.length > 0 && (
            <>
              <div className="col-span-full">
                <Divider />
              </div>
              {Object.entries(ticketByPaymentMethod).map(
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
            </>
          )}
        </div>
      </ScrollShadow>
    </div>
  );
};
