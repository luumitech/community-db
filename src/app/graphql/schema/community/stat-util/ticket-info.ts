import { Ticket } from '@prisma/client';
import { decSum, isNonZeroDec } from '~/lib/decimal-util';

export interface TicketInfoStat {
  /** Unique index for entry */
  key: string;
  /** Membership year when tickets are sold */
  membershipYear: number;
  /** Event name where tickets are sold */
  eventName: string;
  /** Ticket name where the ticket is sold */
  ticketName: string;
  /** Payment method of ticket */
  paymentMethod: string;
  /** # of ticket sold matching above criteria */
  count: number;
  /** Fee collected selling tickets matching above criteria */
  price: string;
}

export class TicketInfo {
  private statMap = new Map<string, TicketInfoStat>();

  constructor() {}

  /** Get statistic entry */
  private getByKey(
    membershipYear: number,
    eventName: string,
    ticket: Ticket
  ): TicketInfoStat {
    const { ticketName, paymentMethod } = ticket;
    const key = `${membershipYear}-${eventName}-${ticketName}-${
      paymentMethod ?? ''
    }`;
    let entry = this.statMap.get(key);
    if (!entry) {
      entry = {
        key,
        membershipYear,
        eventName,
        ticketName,
        paymentMethod: paymentMethod ?? '',
        count: 0,
        price: '0',
      };
      this.statMap.set(key, entry);
    }
    return entry;
  }
  /**
   * Process all tickets sold within membership entry, and collect statistics
   *
   * @param membership Membership entry
   */
  add(membershipYear: number, eventName: string, ticket: Ticket) {
    const { price, count } = ticket;
    const stat = this.getByKey(membershipYear, eventName, ticket);
    stat.count += count ?? 0;
    stat.price = decSum(stat.price, price);
  }

  /** Get ticket sold statistic */
  getStat(): TicketInfoStat[] {
    return (
      [...this.statMap.values()]
        // Only keep entries with +ve count or non zero price
        .filter((entry) => {
          return entry.count > 0 || isNonZeroDec(entry.price);
        })
    );
  }
}
