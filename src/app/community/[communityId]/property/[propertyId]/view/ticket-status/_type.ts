import * as GQL from '~/graphql/generated/graphql';

export type TicketEntry =
  GQL.PropertyId_TicketStatusFragment['membershipList'][number]['eventAttendedList'][number]['ticketList'][number];
