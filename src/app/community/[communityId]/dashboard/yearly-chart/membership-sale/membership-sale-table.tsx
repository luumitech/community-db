import { Divider, ScrollShadow } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { type MembershipStat } from './_type';
import { TableHeader, TableRow, TableSumRow } from './table-row';

export interface Props {
  className?: string;
  membershipList: MembershipStat[];
}

export const MembershipSaleTable: React.FC<Props> = ({
  className,
  membershipList,
}) => {
  const membershipByPaymentMethod = R.groupBy(
    membershipList,
    R.prop('paymentMethod')
  );

  return (
    <ScrollShadow
      className={clsx(className)}
      orientation="horizontal"
      hideScrollBar
    >
      <div className="grid grid-cols-[repeat(4,max-content)] gap-x-6 gap-y-2">
        <TableHeader />
        {membershipList.length === 0 && (
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
        {membershipList.map((membership) => (
          <TableRow
            key={`${membership.eventName}-${membership.paymentMethod}`}
            membership={membership}
          />
        ))}
        {membershipList.length > 0 && (
          <>
            <div className="col-span-full">
              <Divider />
            </div>
            {Object.entries(membershipByPaymentMethod).map(
              ([paymentMethod, memberships]) => {
                return (
                  <TableSumRow
                    key={paymentMethod}
                    membershipList={memberships}
                    paymentMethod={paymentMethod}
                  />
                );
              }
            )}
            <div className="col-span-full">
              <Divider />
            </div>
            <TableSumRow membershipList={membershipList} />
          </>
        )}
      </div>
    </ScrollShadow>
  );
};
