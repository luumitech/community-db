import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { type MembershipFeeStat } from './_type';
import { FeeGridTable, type ColumnKey } from './fee-grid-table';
import { useMembershipFeeList } from './use-membership-fee-list';

export interface Props {
  className?: string;
  membershipFeeStat: MembershipFeeStat;
  isLoading?: boolean;
  groupBy: string;
}

export const MembershipFeeTable: React.FC<Props> = ({
  className,
  membershipFeeStat,
  isLoading,
  groupBy,
}) => {
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
    <FeeGridTable
      // This is applied to the grid container
      className={twMerge(
        'overflow-y-auto',
        groupBy === 'none'
          ? 'grid-cols-[repeat(2,auto)_repeat(2,min-content)_auto]'
          : 'grid-cols-[auto_repeat(2,min-content)]',
        className
      )}
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
      sortDescriptor={sortDescriptor}
      onSortChange={doSort}
    />
  );
};
