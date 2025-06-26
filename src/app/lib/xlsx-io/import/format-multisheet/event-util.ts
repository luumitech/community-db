import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { EventEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { getMapValue } from './map-util';
import { TicketUtil } from './ticket-util';

const mappingType = {
  eventId: 'number',
  membershipId: 'number',
  eventName: 'string',
  eventDate: 'date',
} satisfies MappingTypeSchema;
type MappingEntry = MappingResult<typeof mappingType>;

export class EventUtil {
  private byEventId = new Map<number, MappingEntry>();
  private byMembershipId = new Map<number, MappingEntry[]>();

  constructor(wsHelper?: WorksheetHelper) {
    if (wsHelper) {
      this.parseXlsx(wsHelper);
    }
  }

  private parseXlsx(wsHelper: WorksheetHelper) {
    const importHelper = new ImportHelper(wsHelper, { headerCol: 0 });

    const mappingColIdx: MappingColIdxSchema<typeof mappingType> = {
      eventId: importHelper.labelColumn('eventId'),
      membershipId: importHelper.labelColumn('membershipId'),
      eventName: importHelper.labelColumn('eventName'),
      eventDate: importHelper.labelColumn('eventDate'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byEventId.set(entry.eventId, entry);
      getMapValue(this.byMembershipId, entry.membershipId).push(entry);
    }
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
