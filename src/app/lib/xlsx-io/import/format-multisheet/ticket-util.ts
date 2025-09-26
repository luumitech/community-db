import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { TicketEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { type UtilOpt } from './_type';
import { getMapValue } from './map-util';

const mappingType = {
  ticketId: 'number',
  eventId: 'number',
  ticketName: 'string',
  count: 'number',
  price: 'string',
  paymentMethod: 'string',
} satisfies MappingTypeSchema;
type MappingEntry = MappingResult<typeof mappingType>;

export class TicketUtil {
  private byTicketId = new Map<number, MappingEntry>();
  private byEventId = new Map<number, MappingEntry[]>();

  constructor(wsHelper?: WorksheetHelper) {
    if (wsHelper) {
      this.parseXlsx(wsHelper);
    }
  }

  private parseXlsx(wsHelper: WorksheetHelper) {
    const importHelper = new ImportHelper(wsHelper, { headerCol: 0 });

    const mappingColIdx: MappingColIdxSchema<typeof mappingType> = {
      ticketId: importHelper.labelColumn('ticketId'),
      eventId: importHelper.labelColumn('eventId'),
      ticketName: importHelper.labelColumn('ticketName'),
      count: importHelper.labelColumn('count'),
      price: importHelper.labelColumn('price'),
      paymentMethod: importHelper.labelColumn('paymentMethod'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byTicketId.set(entry.ticketId, entry);
      getMapValue(this.byEventId, entry.eventId).push(entry);
    }
  }

  ticketList(eventId: number, opt: UtilOpt): TicketEntry[] {
    const ticketList = this.byEventId.get(eventId) ?? [];
    return ticketList.map((entry) => {
      const { ticketId, eventId: _eventId, ...ticket } = entry;
      return ticket;
    });
  }
}
