import { cn } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { lsFlags } from '~/lib/env';
import { type MembershipFeeStat } from './_type';
import { FeeTable, type ColumnKey } from './fee-table';
import { GroupBy } from './group-by';
import { useMembershipFeeList } from './use-membership-fee-list';

export interface Props {
  className?: string;
  membershipFeeStat: MembershipFeeStat;
  isLoading?: boolean;
}

export const MembershipFeeTable: React.FC<Props> = ({
  className,
  membershipFeeStat,
  isLoading,
}) => {
  const [groupBy = 'none', setGroupBy] = useLocalStorage(
    lsFlags.dashboardMembershipFeeGroupBy,
    'none'
  );
  const { membershipFeeStatWithId, doSort, sortDescriptor } =
    useMembershipFeeList(membershipFeeStat, groupBy);

  const columnKeys = React.useMemo<ColumnKey[]>(() => {
    switch (groupBy) {
      case 'membershipYear':
        return ['membershipYear', 'count', 'price'];

      case 'eventName':
        return ['eventName', 'count', 'price'];

      case 'paymentMethod':
        return ['paymentMethod', 'count', 'price'];

      case 'none':
      default:
        return [
          'membershipYear',
          'eventName',
          'count',
          'price',
          'paymentMethod',
        ];
    }
  }, [groupBy]);

  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <GroupBy defaultValue={groupBy} onValueChange={setGroupBy} />
      <div className="overflow-y-auto">
        <FeeTable
          // This is applied to the grid container
          className={
            groupBy === 'none'
              ? 'grid-cols-[repeat(2,auto)_repeat(2,min-content)_auto]'
              : 'grid-cols-[auto_repeat(2,min-content)]'
          }
          items={membershipFeeStatWithId}
          isLoading={isLoading}
          columnKeys={columnKeys}
          columnConfig={{
            // membershipYear: cn('font-semibold sm:font-normal'),
            // eventName: cn('font-semibold sm:font-normal'),
            count: cn('pr-2.5'),
            price: cn('pr-2.5'),
            // paymentMethod: cn('font-semibold sm:font-normal'),
          }}
          // topContent={topContent}
          sortDescriptor={sortDescriptor}
          onSortChange={doSort}
        />
      </div>
    </div>
  );
};
