import type { PropertyEntry } from './_type';

/**
 * Process property list and extract ALL ticket names from eventAttendedList of
 * all membership information (ordered by appearance)
 */
export function extractTicketList(propertyList: PropertyEntry[]): string[] {
  const ticketSet = new Set<string>();

  const membershipList = propertyList.flatMap((entry) => entry.membershipList);
  membershipList.forEach((entry) => {
    entry.eventAttendedList.forEach(({ ticketList }) => {
      ticketList.forEach((ticket) => {
        ticketSet.add(ticket.ticketName);
      });
    });
  });

  return [...ticketSet];
}
