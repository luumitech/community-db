import { Community, Membership } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { ByEvent } from './by-event';
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
  /** Event statistic */
  byEvent: ByEvent;
  /** Membership Fee statistics */
  membershipFee: MembershipFee;
  /** Ticket statistics */
  ticketInfo: TicketInfo;
}

/** Collect statistic (indexed by year) */
export class ByYear {
  #statMap = new Map<number, ByYearStat>();

  constructor(private community: Community) {}

  /** Get statistic entry for a given year */
  #getByYear(year: number): ByYearStat {
    let entry = this.#statMap.get(year);
    if (!entry) {
      entry = {
        year,
        renew: 0,
        new: 0,
        noRenewal: 0,
        byEvent: new ByEvent(this.community),
        membershipFee: new MembershipFee(),
        ticketInfo: new TicketInfo(),
      };
      this.#statMap.set(year, entry);
    }
    return entry;
  }

  /**
   * Process the membership entry, and collect statistics
   *
   * @param membership Membership entry
   */
  add(membership: Membership, prevYearMembership: Membership | undefined) {
    const isMemberThisYear = !!membership.isMember;
    const isMemberLastYear = !!prevYearMembership?.isMember;

    const { year, paymentDate, eventAttendedList } = membership;
    const stat = this.#getByYear(year);

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
    stat.byEvent.add(membership, isMemberLastYear);

    /**
     * Gather statistics related to fee collected during the year.
     *
     * The year is indexed from the event date (which is not necessarily the
     * same as membership year, for example, a member may choose to pay fee for
     * next year)
     */
    if (isMemberThisYear) {
      const paymentYear = paymentDate?.getUTCFullYear();
      if (paymentYear) {
        this.#getByYear(paymentYear).membershipFee.add(membership);
      }
      eventAttendedList.forEach((event) => {
        const { eventName, eventDate, ticketList } = event;
        const ticketYear = eventDate?.getUTCFullYear();
        if (ticketYear) {
          ticketList.forEach((ticket) => {
            this.#getByYear(ticketYear).ticketInfo.add(year, eventName, ticket);
          });
        }
      });
    }
  }

  /** Get all statistics for each year */
  getStat(): ByYearStat[] {
    return (
      [...this.#statMap.values()]
        // Sort by year in ascending order
        .sort((a, b) => a.year - b.year)
    );
  }

  /** Get statistic for a specified year */
  getOneStat(year: number): ByYearStat {
    const entry = this.#statMap.get(year);
    if (!entry) {
      throw new GraphQLError(`Statistics not available for year ${year}`);
    }
    return entry;
  }
}
