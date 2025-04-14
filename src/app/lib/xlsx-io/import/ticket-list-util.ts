import type { PropertyEntry } from './_type';

export type Property = Pick<PropertyEntry, 'membershipList'>;

/**
 * Process property list and extract ALL ticket names from eventAttendedList of
 * all membership information (ordered by appearance)
 */
export function extractTicketList(propertyList: Property[]): string[] {
  const ticketSet = new Set<string>();

  propertyList.forEach((property) => {
    property.membershipList.forEach((membership) => {
      membership.eventAttendedList.forEach((event) => {
        event.ticketList.forEach((ticket) => {
          ticketSet.add(ticket.ticketName);
        });
      });
    });
  });

  return [...ticketSet];
}
