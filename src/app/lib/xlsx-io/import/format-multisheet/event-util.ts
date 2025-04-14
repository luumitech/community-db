import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { EventEntry } from '../_type';
import { ImportHelper, type MappingOutput } from '../import-helper';
import { getMapValue } from './map-util';
import { TicketUtil } from './ticket-util';

export class EventUtil {
  private byEventId: ReturnType<typeof this.parseXlsx>['byEventId'];
  private byMembershipId: ReturnType<typeof this.parseXlsx>['byMembershipId'];

  constructor(private wsHelper: WorksheetHelper) {
    const parseResult = this.parseXlsx();
    this.byEventId = parseResult.byEventId;
    this.byMembershipId = parseResult.byMembershipId;
  }

  private parseXlsx() {
    const importHelper = new ImportHelper(this.wsHelper, { headerCol: 0 });

    const mappingSchema = {
      eventId: {
        colIdx: importHelper.labelColumn('eventId'),
        type: 'number',
      },
      membershipId: {
        colIdx: importHelper.labelColumn('membershipId'),
        type: 'number',
      },
      eventName: {
        colIdx: importHelper.labelColumn('eventName'),
        type: 'string',
      },
      eventDate: {
        colIdx: importHelper.labelColumn('eventDate'),
        type: 'date',
      },
    } as const;

    type Entry = MappingOutput<typeof mappingSchema>;
    const byEventId = new Map<number, Entry>();
    const byMembershipId = new Map<number, Entry[]>();

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingSchema);

      byEventId.set(entry.eventId, entry);
      getMapValue(byMembershipId, entry.membershipId).push(entry);
    }

    return {
      byEventId,
      byMembershipId,
    };
  }

  eventAttendedList(
    membershipId: number,
    opt: {
      ticketUtil: TicketUtil;
    }
  ): EventEntry[] {
    const eventAttendedList = this.byMembershipId.get(membershipId) ?? [];
    return eventAttendedList.map((entry) => {
      const { eventId, membershipId: _membershipId, ...event } = entry;
      return {
        ...event,
        ticketList: opt.ticketUtil.ticketList(eventId),
      };
    });
  }
}
