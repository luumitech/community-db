import { Divider } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { decSum } from '~/lib/decimal-util';
import { type TicketStat } from './_type';
import { TicketRow, TicketRowHeader } from './ticket-row';

interface Props {
  className?: string;
  ticketList: TicketStat[];
}

export const TicketSaleTable: React.FC<Props> = ({ className, ticketList }) => {
  return (
    <div
      className={clsx(
        className,
        'grid grid-cols-[repeat(4,max-content)] gap-x-8 gap-y-2',
        'overflow-x-auto overflow-y-hidden'
      )}
    >
      <TicketRowHeader />
      {ticketList.length === 0 && (
        <div
          className={clsx(
            'col-span-full h-8',
            'justify-self-center content-center'
          )}
        >
          <div className="text-sm text-foreground-500">No data to display</div>
        </div>
      )}
      {ticketList.map((ticket) => (
        <TicketRow
          key={`${ticket.ticketName}-${ticket.paymentMethod}`}
          ticket={ticket}
        />
      ))}
      {ticketList.length > 0 && (
        <>
          <div className="col-span-full">
            <Divider />
          </div>
          <TicketRow
            ticket={{
              __typename: 'TicketStat',
              ticketName: '',
              count: R.sumBy(ticketList, ({ count }) => count),
              price: decSum(ticketList.map(({ price }) => price)),
              paymentMethod: '',
            }}
          />
        </>
      )}
    </div>
  );
};
