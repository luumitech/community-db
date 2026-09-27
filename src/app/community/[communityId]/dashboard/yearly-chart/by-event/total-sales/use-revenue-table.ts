import React from 'react';
import * as R from 'remeda';
import { decCompareTo, decSum } from '~/lib/decimal-util';
import type { RevenueEntry, RevenueStat } from '../_type';
import { type SortDescriptor } from './revenue-grid-table';

export function useRevenueTable(stat: RevenueStat, groupBy: string) {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>();

  const rawStat = React.useMemo(() => {
    switch (groupBy) {
      case 'itemName':
        return Object.entries(R.groupBy(stat, R.prop('itemName'))).map(
          ([itemName, ticketStat]) => ({
            id: itemName,
            key: 'not-used',
            itemName,
            eventName: 'not-used',
            paymentMethod: 'not-displayed',
            count: R.sumBy(ticketStat, ({ count }) => count),
            price: decSum(...ticketStat.map(({ price }) => price)),
          })
        );

      case 'paymentMethod':
        return Object.entries(R.groupBy(stat, R.prop('paymentMethod'))).map(
          ([paymentMethod, feeStat]) => ({
            id: paymentMethod,
            key: 'not-used',
            itemName: 'not-used',
            eventName: 'not-displayed',
            paymentMethod,
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
  const statWithId = React.useMemo(() => {
    return sortAndFilter(rawStat, sortDescriptor);
  }, [rawStat, sortDescriptor]);

  return {
    statWithId,
    doSort: setSortDescriptor,
    sortDescriptor,
  };
}

function sortAndFilter(
  _stat: RevenueEntry[],
  sortDescriptor?: SortDescriptor
): RevenueEntry[] {
  const stat = [..._stat];
  if (sortDescriptor != null) {
    const { columnKey, direction } = sortDescriptor;
    switch (columnKey) {
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

      case 'itemName':
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
