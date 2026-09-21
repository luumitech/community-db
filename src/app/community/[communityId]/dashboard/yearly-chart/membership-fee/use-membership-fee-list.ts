import React from 'react';
import * as R from 'remeda';
import { decCompareTo, decSum } from '~/lib/decimal-util';
import type { MembershipFeeStat, MembershipFeeStatEntry } from './_type';
import { type SortDescriptor } from './fee-grid-table';

export function useMembershipFeeList(stat: MembershipFeeStat, groupBy: string) {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>();

  const rawMembershipFeeStat = React.useMemo(() => {
    switch (groupBy) {
      case 'membershipYear':
        return Object.entries(R.groupBy(stat, R.prop('membershipYear'))).map(
          ([yearStr, feeStat]) => ({
            id: yearStr,
            key: 'not-used',
            eventName: 'not-displayed',
            paymentMethod: 'not-displayed',
            membershipYear: parseInt(yearStr, 10),
            count: R.sumBy(feeStat, ({ count }) => count),
            price: decSum(...feeStat.map(({ price }) => price)),
          })
        );

      case 'eventName':
        return Object.entries(R.groupBy(stat, R.prop('eventName'))).map(
          ([eventName, feeStat]) => ({
            id: eventName,
            key: 'not-used',
            eventName,
            paymentMethod: 'not-displayed',
            membershipYear: 0,
            count: R.sumBy(feeStat, ({ count }) => count),
            price: decSum(...feeStat.map(({ price }) => price)),
          })
        );

      case 'paymentMethod':
        return Object.entries(R.groupBy(stat, R.prop('paymentMethod'))).map(
          ([paymentMethod, feeStat]) => ({
            id: paymentMethod,
            key: 'not-used',
            eventName: 'not-displayed',
            paymentMethod,
            membershipYear: 0,
            count: R.sumBy(feeStat, ({ count }) => count),
            price: decSum(...feeStat.map(({ price }) => price)),
          })
        );

      case 'none':
      default:
        return stat.map((entry) => ({
          id: entry.key,
          ...entry,
        }));
    }
  }, [stat, groupBy]);

  /** Filter rawAudienceList based on filters and sort schemes */
  const membershipFeeStatWithId = React.useMemo(() => {
    return sortAndFilterMembershipFeeStat(rawMembershipFeeStat, sortDescriptor);
  }, [rawMembershipFeeStat, sortDescriptor]);

  return {
    membershipFeeStatWithId,
    doSort: setSortDescriptor,
    sortDescriptor,
  };
}

function sortAndFilterMembershipFeeStat(
  _stat: MembershipFeeStatEntry[],
  sortDescriptor?: SortDescriptor
): MembershipFeeStatEntry[] {
  const stat = [..._stat];
  if (sortDescriptor != null) {
    const { columnKey, direction } = sortDescriptor;
    switch (columnKey) {
      case 'membershipYear':
      case 'count':
        stat.sort((a, b) => {
          const aVal = a[columnKey] ?? 0;
          const bVal = b[columnKey] ?? 0;
          const comp = aVal - bVal;
          return direction === 'ascending' ? comp : -comp;
        });
        break;

      case 'price':
        stat.sort((a, b) => {
          const aVal = a[columnKey];
          const bVal = b[columnKey];
          const comp = decCompareTo(aVal, bVal);
          return direction === 'ascending' ? comp : -comp;
        });
        break;

      case 'eventName':
      case 'paymentMethod':
        stat.sort((a, b) => {
          const aVal = a[columnKey] ?? '';
          const bVal = b[columnKey] ?? '';
          const comp = aVal.localeCompare(bVal, undefined, {
            sensitivity: 'accent',
          });
          return direction === 'ascending' ? comp : -comp;
        });
        break;
    }
  }

  return stat;
}
