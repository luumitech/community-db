import { type Dashboard_EventTicketFragment } from '~/graphql/generated/graphql';

export type EventTicketFragment = Dashboard_EventTicketFragment;
export type TicketStat = EventTicketFragment['communityStat']['ticketStat'];
export type TicketStatEntry = Omit<TicketStat[0], '__typename'>;
export type MemberSourceStat =
  EventTicketFragment['communityStat']['memberSourceStat'];
