import { type Ticket } from '@prisma/client';
import * as R from 'remeda';
import { parseAsNumber } from '~/lib/number-util';
import { ITEM_DELIMITER } from './delimiter-util';

/**
 * Ticket strings may contain 0 or more tickets, each ticket is separated by `/`
 *
 * Each ticket has a few properties, separated by `:`:
 *
 *     `${ticketName}:${count}:${price}:${paymentMethod}`;
 */
const TICKET_DELIMITER = '/';
const TICKET_PROPERTY_DELIMITER = ':';

/**
 * Names that goes into excel that are delimited should not contain delimiting
 * characters
 *
 * If they are encountered, filter them out.
 */
function removeDelimiter(input: string) {
  const delimiterCharList = [
    ITEM_DELIMITER,
    TICKET_DELIMITER,
    TICKET_PROPERTY_DELIMITER,
  ].join('');
  return input.replace(new RegExp(`[${delimiterCharList}]`, 'g'), '');
}

/**
 * Convert database ticketList information to xlsx cell value,
 *
 * The return ticketList string will have all delimiters removed
 */
export function toTicketList(input: Ticket[]) {
  const arr = input.map((ticket) => {
    const { ticketName, count, price, paymentMethod } = ticket;
    return [
      ticketName ?? '',
      count?.toString() ?? '',
      price ?? '',
      paymentMethod ?? '',
    ]
      .map(removeDelimiter)
      .join(TICKET_PROPERTY_DELIMITER);
  });
  return arr.join(TICKET_DELIMITER);
}

/**
 * Convert ticketList information from xlsx cell value to database ticketList
 * field
 */
export function parseTicketList(input?: string): Ticket[] {
  if (input == null || R.isEmpty(input.trim())) {
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
