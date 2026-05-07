import { Community, Event } from '@prisma/client';
import { GraphQLError } from 'graphql';

export interface MemberSourceStat {
  eventName: string;
  /** Number of households who renewed in this event */
  renew: number;
  /** Number of households who joined as new member in this event */
  new: number;
  /** Members attending this event is already a member */
  existing: number;
}

export class MemberSource {
  private statMap = new Map<string, MemberSourceStat>();

  constructor(private community: Community) {
    const { eventList } = community;
    eventList.forEach(({ name }) => {
      this.statMap.set(name, {
        eventName: name,
        renew: 0,
        new: 0,
        existing: 0,
      });
    });
  }

  /**
   * Process the event attended list, and collect statistics
   *
   * @param joinEventName Event where membership is registered at
   * @param eventAttendedList Event attended list
   * @param isMemberThisYear Is this household a member this year?
   * @param isMemberLastYear Is this household a member last year?
   */
  add(
    joinEventName: string | null,
    eventAttendedList: Event[],
    isMemberThisYear: boolean,
    isMemberLastYear: boolean
  ) {
    if (!isMemberThisYear) {
      return;
    }

    const eventSet = new Set<string>();
    eventAttendedList.forEach(({ eventName }) => eventSet.add(eventName));

    const renew = isMemberLastYear;
    if (joinEventName) {
      const stat = this.getOneStat(joinEventName);
      if (renew) {
        stat.renew++;
      } else {
        stat.new++;
      }
      eventSet.delete(joinEventName);
    } else {
      throw new Error('paymentEventName missing from membership record');
    }

    eventSet.forEach((eventName) => {
      this.getOneStat(eventName).existing++;
    });
  }

  /** Get all statistics for each event */
  getStat(): MemberSourceStat[] {
    return [...this.statMap.values()];
  }

  /** Get statistic for a specified event */
  getOneStat(eventName: string): MemberSourceStat {
    const entry = this.statMap.get(eventName);
    if (!entry) {
      throw new GraphQLError(`Statistics not available for event ${eventName}`);
    }
    return entry;
  }
}
