import { type Ticket } from '@prisma/client';
import { parseAsNumber } from '~/lib/number-util';

/**
 * Ticket strings may contain 0 or more tickets, each ticket is separated by `/`
 *
 * Each ticket has a few properties, separated by `:`:
 *
 *     `${ticketName}:${count}:${price}:${paymentMethod}`;
 */
const TICKET_DELIMITER = '/';
const TICKET_PROPERTY_DELIMITER = ':';

/** Convert database ticketList information to xlsx cell value */
export function toTicketList(input: Ticket[]) {
  const arr = input.map((ticket) => {
    const { ticketName, count, price, paymentMethod } = ticket;
    return [
      ticketName ?? '',
      count ?? '',
      price ?? '',
      paymentMethod ?? '',
    ].join(TICKET_PROPERTY_DELIMITER);
  });
  return arr.join(TICKET_DELIMITER);
}

/**
 * Convert ticketList information from xlsx cell value to database ticketList
 * field
 */
export function parseTicketList(input?: string): Ticket[] {
  if (input == null) {
    return [];
  }
  return input.split(TICKET_DELIMITER).map((ticketStr) => {
    const ticketProp = ticketStr.split(TICKET_PROPERTY_DELIMITER);
    const ticket: Ticket = {
      ticketName: ticketProp[0] ?? '',
      count: parseAsNumber(ticketProp[1]),
      price: ticketProp[2] ?? null,
      paymentMethod: ticketProp[3] ?? null,
    };
    return ticket;
  });
}
