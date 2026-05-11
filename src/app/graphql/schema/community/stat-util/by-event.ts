import { Community, Event, Membership } from '@prisma/client';
import { GraphQLError } from 'graphql';

export interface ByEventStat {
  eventName: string;
  /** Number of households who renewed in this event */
  renew: number;
  /** Number of households who joined as new member in this event */
  new: number;
  /**
   * Number of households attending this event who had registered in prior
   * events
   */
  existing: number;
  /** Total number of households (not registered as member) attending this event */
  nonMember: number;
}

/** Collect events statistic (indexed by event name) */
export class ByEvent {
  #statMap = new Map<string, ByEventStat>();

  constructor(private community: Community) {
    const { eventList } = community;
    eventList.forEach(({ name }) => {
      // This will initialize the statistic object for each events configured in the eventList
      this.getOneStat(name);
    });
  }

  /**
   * Analyse each membership entry, and their eventAttendedList to gather
   * satistics for each event
   *
   * @param membership Membership entry
   * @param isMemberLastYear Is this household a member last year?
   */
  add(membership: Membership, isMemberLastYear: boolean) {
    const { eventAttendedList } = membership;

    const eventSet = new Set(
      eventAttendedList.map(({ eventName }) => eventName)
    );

    if (membership.isMember) {
      const renew = isMemberLastYear;
      const joinEventName = membership.paymentEventName;
      const stat = this.getOneStat(joinEventName);
      if (renew) {
        stat.renew++;
      } else {
        stat.new++;
      }
      if (joinEventName) {
        eventSet.delete(joinEventName);
      }
    }

    eventSet.forEach((eventName) => {
      const stat = this.getOneStat(eventName);
      if (membership.isMember) {
        stat.existing++;
      } else {
        stat.nonMember++;
      }
    });
  }

  /** Get all statistics for each event */
  getStat(): ByEventStat[] {
    return [...this.#statMap.values()];
  }

  /** Get statistic for a specified event */
  getOneStat(_eventName: string | null): ByEventStat {
    /**
     * The UI prevents users from registering without an event. But in the rare
     * case that it happens, it is possible to have a member registering without
     * an event. In such case, we still want to capture this as 'Ether' event.
     */
    const eventName = _eventName ?? 'Other';
    const entry = this.#statMap.get(eventName);
    if (entry) {
      return entry;
    }

    // Create the initial entry, if it has not been created before
    const newEntry = {
      eventName,
      renew: 0,
      new: 0,
      existing: 0,
      nonMember: 0,
    };
    this.#statMap.set(eventName, newEntry);
    return newEntry;
  }
}
