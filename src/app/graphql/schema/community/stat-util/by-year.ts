import { Community, Membership } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { MemberSource } from './member-source';
import { MembershipFee } from './membership-fee';
import { TicketInfo } from './ticket-info';

export interface ByYearStat {
  year: number;
  /** Number of households who renewed this year */
  renew: number;
  /** Number of households who joined this year as new member */
  new: number;
  /** Number of households who were member last year, but did not renew this year */
  noRenewal: number;
  /** Membership Source statistic */
  memberSource: MemberSource;
  /** Membership Fee statistics */
  membershipFee: MembershipFee;
  /** Ticket statistics */
  ticketInfo: TicketInfo;
}

/** Collect statistic (indexed by year) */
export class ByYear {
  private statMap = new Map<number, ByYearStat>();

  constructor(private community: Community) {}

  /** Get statistic entry for a given year */
  private getByYear(year: number): ByYearStat {
    let entry = this.statMap.get(year);
    if (!entry) {
      entry = {
        year,
        renew: 0,
        new: 0,
        noRenewal: 0,
        memberSource: new MemberSource(this.community),
        membershipFee: new MembershipFee(),
        ticketInfo: new TicketInfo(),
      };
      this.statMap.set(year, entry);
    }
    return entry;
  }

  /**
   * Process the membership entry, and collect statistics
   *
   * @param membership Membership entry
   * @param isMemberThisYear Is this household a member this year?
   * @param isMemberLastYear Is this household a member last year?
   */
  add(
    membership: Membership,
    isMemberThisYear: boolean,
    isMemberLastYear: boolean
  ) {
    const { year, eventAttendedList } = membership;
    const stat = this.getByYear(year);

    if (isMemberLastYear) {
      if (isMemberThisYear) {
        stat.renew++;
      } else {
        stat.noRenewal++;
      }
    } else if (isMemberThisYear) {
      stat.new++;
    }
    // Gather statistics indexed by event name
    stat.memberSource.add(
      eventAttendedList,
      isMemberThisYear,
      isMemberLastYear
    );

    /**
     * Gather statistics related to fee collected during the year.
     *
     * The year is indexed from the event date (which is not necessarily the
     * same as membership year, for example, a member may choose to pay fee for
     * next year)
     */
    if (isMemberThisYear) {
      const joinEvent = eventAttendedList[0];
      const paymentYear = joinEvent.eventDate?.getUTCFullYear();
      if (paymentYear) {
        this.getByYear(paymentYear).membershipFee.add(membership);
      }
      eventAttendedList.forEach((event) => {
        const { eventName, eventDate, ticketList } = event;
        const ticketYear = eventDate?.getUTCFullYear();
        if (ticketYear) {
          ticketList.forEach((ticket) => {
            this.getByYear(ticketYear).ticketInfo.add(year, eventName, ticket);
          });
        }
      });
    }
  }

  /** Get all statistics for each year */
  getStat(): ByYearStat[] {
    return (
      [...this.statMap.values()]
        // Sort by year in ascending order
        .sort((a, b) => a.year - b.year)
    );
  }

  /** Get statistic for a specified year */
  getOneStat(year: number): ByYearStat {
    const entry = this.statMap.get(year);
    if (!entry) {
      throw new GraphQLError(`Statistics not available for year ${year}`);
    }
    return entry;
  }
}
