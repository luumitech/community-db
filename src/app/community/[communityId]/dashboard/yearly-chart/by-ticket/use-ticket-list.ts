import React from 'react';
import * as R from 'remeda';
import { decCompareTo, decSum } from '~/lib/decimal-util';
import { usePageContext } from '../../page-context';
import type { TicketStat, TicketStatEntry } from './_type';
import { type SortDescriptor } from './ticket-grid-table';

export function useTicketList(stat: TicketStat, groupBy: string) {
  const { ticketSelected } = usePageContext();
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>();

  const ticketList = React.useMemo(() => {
    if (!ticketSelected) {
      return [];
    }
    return stat.filter(({ ticketName }) => ticketName === ticketSelected);
  }, [stat, ticketSelected]);

  const rawTicketStat = React.useMemo(() => {
    switch (groupBy) {
      case 'eventName':
        return Object.entries(R.groupBy(ticketList, R.prop('eventName'))).map(
          ([eventName, ticketStat]) => ({
            id: eventName,
            key: 'not-used',
            ticketName: 'not-used',
            membershipYear: NaN,
            eventName,
            paymentMethod: 'not-displayed',
            count: R.sumBy(ticketStat, ({ count }) => count),
            price: decSum(...ticketStat.map(({ price }) => price)),
          })
        );

      case 'paymentMethod':
        return Object.entries(
          R.groupBy(ticketList, R.prop('paymentMethod'))
        ).map(([paymentMethod, feeStat]) => ({
          id: paymentMethod,
          key: 'not-used',
          ticketName: 'not-used',
          membershipYear: NaN,
          eventName: 'not-displayed',
          paymentMethod,
          count: R.sumBy(feeStat, ({ count }) => count),
          price: decSum(...feeStat.map(({ price }) => price)),
        }));

      case 'none':
      default:
        return ticketList.map((entry) => ({
          id: entry.key,
          ...entry,
        }));
    }
  }, [ticketList, groupBy]);

  /** Filter rawAudienceList based on filters and sort schemes */
  const ticketStatWithId = React.useMemo(() => {
    return sortAndFilter(rawTicketStat, sortDescriptor);
  }, [rawTicketStat, sortDescriptor]);

  return {
    ticketStatWithId,
    doSort: setSortDescriptor,
    sortDescriptor,
  };
}

function sortAndFilter(
  _stat: TicketStatEntry[],
  sortDescriptor?: SortDescriptor
): TicketStatEntry[] {
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
