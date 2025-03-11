import { Membership } from '@prisma/client';
import { decSum, isNonZeroDec } from '~/lib/decimal-util';

export interface MembershipFeeStat {
  /** Unique index for entry */
  key: string;
  /** Membership year the membership fee is intended for */
  membershipYear: number;
  /** Event name where the membership fee is gathered */
  eventName: string;
  /** Payment method of membership fee */
  paymentMethod: string;
  /** Membership fee paid matching above criteria */
  count: number;
  /** Membership Fee collected matching above criteria */
  price: string;
}

export class MembershipFee {
  private statMap = new Map<string, MembershipFeeStat>();

  constructor() {}

  /** Get statistic entry */
  private getByKey(membership: Membership): MembershipFeeStat {
    const { paymentMethod, year } = membership;
    const joinEvent = membership.eventAttendedList[0];
    const { eventName } = joinEvent;
    const key = `${year}-${eventName}-${paymentMethod ?? ''}`;
    let entry = this.statMap.get(key);
    if (!entry) {
      entry = {
        key,
        membershipYear: year,
        eventName,
        paymentMethod: paymentMethod ?? '',
        count: 0,
        price: '0',
      };
      this.statMap.set(key, entry);
    }
    return entry;
  }
  /**
   * Process the membership entry, and collect statistics
   *
   * @param membership Membership entry
   */
  add(membership: Membership) {
    const { price } = membership;
    const stat = this.getByKey(membership);
    stat.count++;
    stat.price = decSum(stat.price, price);
  }

  /** Get membership fee statistic */
  getStat(): MembershipFeeStat[] {
    return (
      [...this.statMap.values()]
        // Only keep entries with +ve count or non zero price
        .filter((entry) => {
          return entry.count > 0 || isNonZeroDec(entry.price);
        })
    );
  }
}
