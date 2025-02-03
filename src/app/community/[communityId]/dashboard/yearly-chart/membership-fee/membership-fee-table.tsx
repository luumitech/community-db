import { Divider, ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useLocalStorage } from 'usehooks-ts';
import { lsFlags } from '~/lib/env-var';
import { type MembershipStat } from './_type';
import { GroupBy } from './group-by';
import { TableHeader, TableRow, TableSumRow } from './table-row';

export interface Props {
  className?: string;
  membershipList: MembershipStat[];
}

export const MembershipFeeTable: React.FC<Props> = ({
  className,
  membershipList,
}) => {
  const [groupBy, setGroupBy] = useLocalStorage(
    lsFlags.dashboardMembershipFeeGroupBy,
    'none'
  );

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <GroupBy defaultValue={groupBy} onValueChange={setGroupBy} />
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-6 gap-y-2">
          <TableHeader />
          {membershipList.length === 0 && (
            <div
              className={cn(
                'col-span-full h-8',
                'justify-self-center content-center'
              )}
            >
              <div className="text-sm text-foreground-500">
                No data to display
              </div>
            </div>
          )}
          {groupBy === 'none' &&
            membershipList.map((membership) => (
              <TableRow
                key={`${membership.eventName}-${membership.paymentMethod}`}
                membership={membership}
              />
            ))}
          {groupBy === 'eventName' &&
            Object.entries(R.groupBy(membershipList, R.prop('eventName'))).map(
              ([eventName, memberships]) => {
                return (
                  <TableSumRow
                    key={eventName}
                    membershipList={memberships}
                    eventName={eventName}
                  />
                );
              }
            )}
          {groupBy === 'paymentMethod' &&
            Object.entries(
              R.groupBy(membershipList, R.prop('paymentMethod'))
            ).map(([paymentMethod, memberships]) => {
              return (
                <TableSumRow
                  key={paymentMethod}
                  membershipList={memberships}
                  paymentMethod={paymentMethod}
                />
              );
            })}
          <div className="col-span-full">
            <Divider />
          </div>
          <TableSumRow membershipList={membershipList} />
        </div>
      </ScrollShadow>
    </div>
  );
};
