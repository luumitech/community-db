import { type Membership } from '@prisma/client';

export interface Property {
  membershipList: Pick<Membership, 'eventAttendedList'>[];
}

/**
 * Process property list and extract ALL ticket names from eventAttendedList of
 * all membership information (ordered by appearance)
 */
export function extractTicketList(propertyList: Property[]): string[] {
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
