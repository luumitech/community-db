import { type Dashboard_EventTicketFragment } from '~/graphql/generated/types';

export type EventTicketFragment = Dashboard_EventTicketFragment;
export type RevenueStat = {
  key: string;
  // This can be ticket Name or membership fee
  itemName: string;
  eventName: string;
  paymentMethod: string;
  count: number;
  price: string;
}[];
export type RevenueEntry = Omit<RevenueStat[number], '__typename'> & {
  /** Unique ID for each entry, required for GridTable rendering */
  id: string;
};
export type ByEventStat =
  EventTicketFragment['communityStat']['byEventStat'][number];
