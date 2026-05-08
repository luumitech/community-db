import { Community, Property } from '@prisma/client';
import { ByYear } from './by-year';
export { type ByEventStat } from './by-event';
export { type ByYearStat } from './by-year';
export { type MembershipFeeStat } from './membership-fee';
export { type TicketInfoStat } from './ticket-info';

export class StatUtil {
  #byYear: ByYear;

  constructor(
    community: Community,
    propertyList: Pick<Property, 'id' | 'membershipList'>[]
  ) {
    this.#byYear = new ByYear(community);

    // Loop through all membership information and collect statistics
    propertyList.forEach(({ membershipList }) => {
      membershipList.forEach((entry, idx) => {
        /**
         * MembershipList are sorted in descending order, so previous year would
         * be the next entry
         */
        this.#byYear.add(entry, membershipList[idx + 1]);
      });
    });
  }

  /**
   * Return member count statistics for each year
   *
   * - Members who newly joined
   * - Members who renewed membership
   * - Members who joined last year, but not this year
   */
  memberCountStat() {
    return this.#byYear.getStat();
  }

  /**
   * Return statistics for each event
   *
   * - Members who joined in the event (new/renew)
   * - Existing members who attended event (existing)
   * - Non-members attended event
   */
  byEvent(year: number) {
    return this.#byYear.getOneStat(year).byEvent.getStat();
  }

  /**
   * Return Membership fee statistics for a specified year
   *
   * - Membership count
   * - Membership fee collected
   */
  membershipFeeStat(year: number) {
    return this.#byYear.getOneStat(year).membershipFee.getStat();
  }

  /**
   * Return ticket statistics for a specified year
   *
   * - Ticket count
   * - Ticket revenue
   */
  ticketStat(year: number) {
    return this.#byYear.getOneStat(year).ticketInfo.getStat();
  }
}
