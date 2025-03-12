import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import { type MembershipFeeStatEntry } from './_type';

interface TableHeaderProps {
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ className }) => {
  return (
    <div
      className={cn(
        className,
        'grid col-span-full grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'text-tiny font-semibold items-center',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader">Membership Year</div>
      <div role="columnheader">Event Name</div>
      <div role="columnheader">#</div>
      <div role="columnheader">Price</div>
      <div role="columnheader">Payment Method</div>
    </div>
  );
};

interface TableRowProps {
  className?: string;
  stat: MembershipFeeStatEntry;
}

export const TableRow: React.FC<TableRowProps> = ({ className, stat }) => {
  return (
    <>
      <div
        className={cn(
          className,
          'grid col-span-full grid-cols-subgrid mx-3',
          'text-sm items-center'
        )}
        role="row"
      >
        <div role="cell">{stat.membershipYear || ''}</div>
        <div role="cell">{stat.eventName}</div>
        <div className="flex justify-end" role="cell">
          <span className="font-mono">{stat.count}</span>
        </div>
        <div className="flex justify-between gap-2" role="cell">
          <span className="text-default-400">$</span>
          <span className="font-mono">{formatCurrency(stat.price)}</span>
        </div>
        <div role="cell">{stat.paymentMethod}</div>
      </div>
    </>
  );
};

interface TableSumRowProps {
  className?: string;
  membershipFeeStat: MembershipFeeStatEntry[];
  eventName?: string;
  membershipYear?: number;
  paymentMethod?: string;
}

/** Sum all membership count and price for `membershipList` */
export const TableSumRow: React.FC<TableSumRowProps> = ({
  className,
  membershipFeeStat,
  eventName,
  membershipYear,
  paymentMethod,
}) => {
  return (
    <TableRow
      className={className}
      stat={{
        key: 'no-used',
        eventName: eventName ?? '',
        membershipYear: membershipYear ?? 0,
        paymentMethod: paymentMethod ?? '',
        count: R.sumBy(membershipFeeStat, ({ count }) => count),
        price: decSum(...membershipFeeStat.map(({ price }) => price)),
      }}
    />
  );
};
