import { Divider, ScrollShadow, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useLocalStorage } from 'usehooks-ts';
import { lsFlags } from '~/lib/env';
import { type MembershipFeeStat } from './_type';
import { GroupBy } from './group-by';
import { TableHeader, TableRow, TableSumRow } from './table-row';

export interface Props {
  className?: string;
  membershipFeeStat: MembershipFeeStat;
}

export const MembershipFeeTable: React.FC<Props> = ({
  className,
  membershipFeeStat,
}) => {
  const [groupBy, setGroupBy] = useLocalStorage(
    lsFlags.dashboardMembershipFeeGroupBy,
    'none'
  );

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <GroupBy defaultValue={groupBy} onValueChange={setGroupBy} />
      <ScrollShadow className="overflow-y-hidden" orientation="horizontal">
        <div className="grid grid-cols-[repeat(5,max-content)] gap-x-6 gap-y-2">
          <TableHeader />
          {membershipFeeStat.length === 0 && (
            <div
              className={cn(
                'col-span-full h-8',
                'content-center justify-self-center'
              )}
            >
              <div className="text-sm text-foreground-500">
                No data to display
              </div>
            </div>
          )}
          {groupBy === 'none' &&
            membershipFeeStat.map((stat) => (
              <TableRow key={stat.key} stat={stat} />
            ))}
          {groupBy === 'membershipYear' &&
            Object.entries(
              R.groupBy(membershipFeeStat, R.prop('membershipYear'))
            ).map(([yearStr, feeStat]) => {
              return (
                <TableSumRow
                  key={yearStr}
                  membershipFeeStat={feeStat}
                  membershipYear={parseInt(yearStr, 10)}
                />
              );
            })}
          {groupBy === 'eventName' &&
            Object.entries(
              R.groupBy(membershipFeeStat, R.prop('eventName'))
            ).map(([eventName, feeStat]) => {
              return (
                <TableSumRow
                  key={eventName}
                  membershipFeeStat={feeStat}
                  eventName={eventName}
                />
              );
            })}
          {groupBy === 'paymentMethod' &&
            Object.entries(
              R.groupBy(membershipFeeStat, R.prop('paymentMethod'))
            ).map(([paymentMethod, feeStat]) => {
              return (
                <TableSumRow
                  key={paymentMethod}
                  membershipFeeStat={feeStat}
                  paymentMethod={paymentMethod}
                />
              );
            })}
          <div className="col-span-full">
            <Divider />
          </div>
          <TableSumRow membershipFeeStat={membershipFeeStat} />
        </div>
      </ScrollShadow>
    </div>
  );
};
