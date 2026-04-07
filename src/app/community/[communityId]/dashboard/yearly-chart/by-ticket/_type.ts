import { type Dashboard_ByTicketFragment } from '~/graphql/generated/graphql';

export type ByTicketFragment = Dashboard_ByTicketFragment;
export type TicketStat = ByTicketFragment['communityStat']['ticketStat'];
export type TicketStatEntry = Omit<TicketStat[number], '__typename'>;
