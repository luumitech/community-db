import * as GQL from '~/graphql/generated/graphql';

export type TicketInfoEntry = ReturnType<typeof ticketInfoForYear>[number];
export type TicketRowEntry = ReturnType<typeof makeTicketRow>;

export function ticketInfoForYear(
  property: GQL.PropertyId_TicketStatusFragment
) {
  const result = property.membershipList.flatMap(
    ({ eventAttendedList, ...membership }) => {
      return eventAttendedList.flatMap(({ ticketList, ...event }) => {
        return ticketList.flatMap((ticket, idx) => {
          return {
            membership,
            event,
            ticket,
            ticketIdx: idx,
          };
        });
      });
    }
  );

  return result;
}

export function makeTicketRow(ticketInfo: TicketInfoEntry) {
  const { membership, event, ticket, ticketIdx } = ticketInfo;

  return {
    id: `${membership.year}-${event.eventName}-${ticket.ticketName}-${ticketIdx}`,
    eventName: event.eventName,
    eventDate: event.eventDate,
    ticketCount: ticket.count,
    ticketPrice: ticket.price,
  };
}
