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
   * @param eventAttendedList Event attended list
   * @param isMemberThisYear Is this household a member this year?
   * @param isMemberLastYear Is this household a member last year?
   */
  add(
    eventAttendedList: Event[],
    isMemberThisYear: boolean,
    isMemberLastYear: boolean
  ) {
    if (!isMemberThisYear) {
      return;
    }

    const renew = isMemberLastYear;
    // `isMemberThisYear` guarantees `entry.eventAttendedList` to have at least one entry
    const [joinEvent, ...otherEvent] = eventAttendedList;

    const stat = this.getOneStat(joinEvent.eventName);
    if (renew) {
      stat.renew++;
    } else {
      stat.new++;
    }
    otherEvent.forEach((event) => {
      this.getOneStat(event.eventName).existing++;
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
