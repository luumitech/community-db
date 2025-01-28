import { type Dashboard_EventTicketFragment } from '~/graphql/generated/graphql';

export type EventTicketFragment = Dashboard_EventTicketFragment;
export type EventStat = EventTicketFragment['communityStat']['eventStat'];
export type TicketStat = EventStat[0]['ticketList'][0];
