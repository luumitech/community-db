import {
  Membership,
  Property,
  SupportedEventItem,
  SupportedPaymentMethod,
  SupportedTicketItem,
  Ticket,
} from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as R from 'remeda';
import { decSum, isNonZeroDec } from '~/lib/decimal-util';
import { isMember } from '../property/util';

/** Statistic for the community */
export interface CommunityStat {
  /**
   * Unique id representing membership information for all properties within
   * this community
   */
  id: string;
  /** Community Id */
  communityId: string;
  /** Minimum year represented in membership information */
  minYear: number;
  /** Maximum year represented in membership information */
  maxYear: number;
  /** List of all properties within this community */
  propertyList: Pick<Property, 'id' | 'membershipList'>[];
  /** List of all supported events */
  supportedEventList: SupportedEventItem[];
  /** List of all supported tickets */
  supportedTicketList: SupportedTicketItem[];
  /** List of all supported payment methods */
  supportedPaymentMethods: SupportedPaymentMethod[];
}

/** Member count statistic for each year */
export interface MemberCountStat {
  /** Membership year associated to this entry */
  year: number;
  /** Number of households who renewed this year */
  renew: number;
  /** Number of households who joined this year as new member */
  new: number;
  /** Number of households who were member last year, but did not renew this year */
  noRenewal: number;
}

/** Event statistics for a given year */
export interface EventStat {
  /** Event name associated to this entry */
  eventName: string;
  /** Members who renewed via this event */
  renew: number;
  /** Members who newly joined member via this event */
  new: number;
  /** Members who have already joined */
  existing: number;
  /** Membership statistics for this event, indexed by payment method */
  membershipMap: MembershipMap;
  /** Ticket statistics for this event, indexed by ticket name */
  ticketMap: TicketMap;
}

/** Membership statistics for a given event */
export interface MembershipStat {
  /** Membership count for this group of MembershipStat */
  count: number;
  /** Total Membership collected for this group of MembershipStat */
  price: string;
  /** Payment method used for this group of MembershipStat */
  paymentMethod: string;
}

/** Ticket statistics for a given event */
export interface TicketStat {
  /** Ticket name for this group of TicketStat */
  ticketName: string;
  /** Ticket count for this group of TicketStat */
  count: number;
  /** Total ticket sold for this group of TicketStat */
  price: string;
  /** Payment method used for this group of TicketStat */
  paymentMethod: string;
}

// keyed by payment method
type MembershipMap = Map<string, MembershipStat>;
// keyed by payment method
type TicketPaymentMap = Map<string, TicketStat>;
// keyed by ticket name
type TicketMap = Map<string, TicketPaymentMap>;

export class StatUtil {
  private propertyList: CommunityStat['propertyList'];
  /** List of all non-hidden events available in system */
  private allEvents = new Set<string>();
  /** List of all non-hidden ticket types available in system */
  private allTickets = new Set<string>();
  /** List of all payment methods available in system */
  private allPaymentMethods = new Set<string>();
  private minYear: number;
  private maxYear: number;

  constructor(communityStat: CommunityStat) {
    this.propertyList = communityStat.propertyList;
    this.minYear = communityStat.minYear;
    this.maxYear = communityStat.maxYear;
    communityStat.supportedEventList.forEach((entry) => {
      if (!entry.hidden) {
        this.allEvents.add(entry.name);
      }
    });
    /**
     * Show all tickets and payment methods (including hidden) because we want
     * to make sure the statistics accounts for all tickets purchased
     */
    communityStat.supportedTicketList.forEach((entry) => {
      this.allTickets.add(entry.name);
    });
    communityStat.supportedPaymentMethods.forEach((entry) => {
      this.allPaymentMethods.add(entry.name);
    });
  }

  /** Add membership entry into the membershipMap */
  private addMembershipToMap(membershipMap: MembershipMap, entry: Membership) {
    const { paymentMethod, price } = entry;
    const membershipEntry = membershipMap.get(paymentMethod ?? '');
    if (membershipEntry) {
      membershipEntry.count++;
      membershipEntry.price = decSum(membershipEntry.price, price);
    }
  }

  /** Add list of tickets into the ticketMap */
  private addTicketToMap(ticketMap: TicketMap, ticketList: Ticket[]) {
    ticketList.forEach(({ ticketName, count, price, paymentMethod }) => {
      const hasCount = count != null && count > 0;
      const hasPrice = isNonZeroDec(price);
      if (hasCount || hasPrice) {
        const ticketEntry = ticketMap.get(ticketName)?.get(paymentMethod ?? '');
        if (ticketEntry) {
          ticketEntry.count += count ?? 0;
          ticketEntry.price = decSum(ticketEntry.price, price);
        }
      }
    });
  }

  /**
   * Collect statistics for a specified year
   *
   * - Members who newly joined this year
   * - Members who renewed membership
   * - Members who joined last year, but not this year
   */
  getMemberCountStatMap() {
    const statMap = new Map<number, MemberCountStat>();
    R.range(this.minYear, this.maxYear + 1).forEach((year) => {
      statMap.set(year, { year, renew: 0, new: 0, noRenewal: 0 });
    });
    this.propertyList.forEach(({ membershipList }) => {
      membershipList.forEach((entry, idx) => {
        const { year } = entry;
        const entryIsMember = isMember(entry);
        const mapEntry = statMap.get(year);
        if (!mapEntry) {
          throw new GraphQLError(
            `year ${year} in propertyStat entry fell outside min/maxYear`
          );
        }
        const isMemberLastYear = isMember(membershipList[idx + 1]);
        if (isMemberLastYear) {
          if (entryIsMember) {
            mapEntry.renew++;
          } else {
            mapEntry.noRenewal++;
          }
        } else if (entryIsMember) {
          mapEntry.new++;
        }
      });
    });
    return statMap;
  }

  /**
   * Collect statistics for each event in the specified year
   *
   * - Members who joined in the event (new/renew)
   * - Members who joined in other event (existing)
   * - Tickets sold during events
   */
  getEventStatMap(
    /** Year to retrieve statistics for */
    year: number
  ) {
    const eventMap = new Map<string, EventStat>();
    this.allEvents.forEach((eventName) => {
      const membershipMap = new Map<string, MembershipStat>();
      this.allPaymentMethods.forEach((paymentMethod) => {
        membershipMap.set(paymentMethod, {
          count: 0,
          price: '0',
          paymentMethod,
        });
      });

      const ticketMap = new Map<string, TicketPaymentMap>();
      this.allTickets.forEach((ticketName) => {
        const ticketPaymentMap = new Map<string, TicketStat>();
        // Add empty payment method to the list
        [...this.allPaymentMethods, ''].forEach((paymentMethod) => {
          ticketPaymentMap.set(paymentMethod, {
            ticketName,
            count: 0,
            price: '0',
            paymentMethod,
          });
        });
        ticketMap.set(ticketName, ticketPaymentMap);
      });
      eventMap.set(eventName, {
        eventName,
        new: 0,
        renew: 0,
        existing: 0,
        membershipMap,
        ticketMap,
      });
    });

    this.propertyList.forEach(({ membershipList }) => {
      // For each address, go through all membership information
      // to collect statistic for each year
      membershipList.forEach((entry, idx) => {
        if (entry.year === year && isMember(entry)) {
          const renew = !!isMember(membershipList[idx + 1]);
          // `isMember()` guarantees `entry.eventAttendedList` to have at least one entry
          const joinEvent = entry.eventAttendedList.shift()!;
          const otherEvent = entry.eventAttendedList;

          const joinEntry = eventMap.get(joinEvent.eventName);
          if (joinEntry) {
            if (renew) {
              joinEntry.renew++;
            } else {
              joinEntry.new++;
            }
            this.addMembershipToMap(joinEntry.membershipMap, entry);
            this.addTicketToMap(joinEntry.ticketMap, joinEvent.ticketList);
          }
          otherEvent.forEach((event) => {
            const mapEntry = eventMap.get(event.eventName);
            if (mapEntry) {
              mapEntry.existing++;
              this.addTicketToMap(mapEntry.ticketMap, event.ticketList);
            }
          });
        }
      });
    });

    return eventMap;
  }
}
