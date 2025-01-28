import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { decSum, formatCurrency } from '~/lib/decimal-util';
import { type MembershipStat } from './_type';

type MembershipStatEntry = Omit<MembershipStat, '__typename'>;

interface TableHeaderProps {
  className?: string;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        className,
        'grid col-span-full grid-cols-subgrid',
        'h-10 bg-default-100 text-foreground-500',
        'text-tiny font-semibold items-center',
        'rounded-lg px-3'
      )}
      role="row"
    >
      <div role="columnheader">Event Name</div>
      <div role="columnheader">#</div>
      <div role="columnheader">Price</div>
      <div role="columnheader">Payment Method</div>
    </div>
  );
};

interface TableRowProps {
  className?: string;
  membership: MembershipStatEntry;
}

export const TableRow: React.FC<TableRowProps> = ({
  className,
  membership,
}) => {
  return (
    <>
      <div
        className={clsx(
          className,
          'grid col-span-full grid-cols-subgrid mx-3',
          'text-sm items-center'
        )}
        role="row"
      >
        <div role="cell">{membership.eventName}</div>
        <div className="flex justify-end" role="cell">
          <span className="font-mono">{membership.count}</span>
        </div>
        <div className="flex justify-between gap-2" role="cell">
          <span className="text-default-400">$</span>
          <span className="font-mono">{formatCurrency(membership.price)}</span>
        </div>
        <div role="cell">{membership.paymentMethod}</div>
      </div>
    </>
  );
};

interface TableSumRowProps {
  className?: string;
  membershipList: MembershipStatEntry[];
  eventName?: string;
  paymentMethod?: string;
}

/** Sum all membership count and price for `membershipList` */
export const TableSumRow: React.FC<TableSumRowProps> = ({
  className,
  membershipList,
  eventName,
  paymentMethod,
}) => {
  return (
    <TableRow
      className={className}
      membership={{
        eventName: eventName ?? '',
        count: R.sumBy(membershipList, ({ count }) => count),
        price: decSum(membershipList.map(({ price }) => price)),
        paymentMethod: paymentMethod ?? '',
      }}
    />
  );
};
