import { Community, Property } from '@prisma/client';
import { isMember } from '~/graphql/schema/property/util';
import { ByYear } from './by-year';
export { type ByYearStat } from './by-year';
export { type MemberSourceStat } from './member-source';
export { type MembershipFeeStat } from './membership-fee';
export { type TicketInfoStat } from './ticket-info';

export class StatUtil {
  private byYear: ByYear;

  constructor(
    community: Community,
    propertyList: Pick<Property, 'id' | 'membershipList'>[]
  ) {
    this.byYear = new ByYear(community);

    // Loop through all membership information and collect statistics
    propertyList.forEach(({ membershipList }) => {
      membershipList.forEach((entry, idx) => {
        const isMemberThisYear = isMember(entry);
        /**
         * MembershipList are sorted in descending order, so previous year would
         * be the next entry
         */
        const isMemberLastYear = isMember(membershipList[idx + 1]);
        this.byYear.add(entry, isMemberThisYear, isMemberLastYear);
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
    return this.byYear.getStat();
  }

  /**
   * Return member source statistics for each event
   *
   * - Members who joined in the event (new/renew)
   * - Members who joined in other event (existing)
   */
  memberSourceStat(year: number) {
    return this.byYear.getOneStat(year).memberSource.getStat();
  }

  /**
   * Return Membership fee statistics for a specified year
   *
   * - Membership count
   * - Membership fee collected
   */
  membershipFeeStat(year: number) {
    return this.byYear.getOneStat(year).membershipFee.getStat();
  }

  /**
   * Return ticket statistics for a specified year
   *
   * - Ticket count
   * - Ticket revenue
   */
  ticketStat(year: number) {
    return this.byYear.getOneStat(year).ticketInfo.getStat();
  }
}
