import { type Dashboard_EventTicketFragment } from '~/graphql/generated/types';

export type EventTicketFragment = Dashboard_EventTicketFragment;
export type TicketStat = EventTicketFragment['communityStat']['ticketStat'];
export type TicketStatEntry = Omit<TicketStat[number], '__typename'>;
export type ByEventStat =
  EventTicketFragment['communityStat']['byEventStat'][number];
