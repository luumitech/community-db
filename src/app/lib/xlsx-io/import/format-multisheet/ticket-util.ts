import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { TicketEntry } from '../_type';
import { ImportHelper, type MappingOutput } from '../import-helper';
import { getMapValue } from './map-util';

export class TicketUtil {
  private byTicketId: ReturnType<typeof this.parseXlsx>['byTicketId'];
  private byEventId: ReturnType<typeof this.parseXlsx>['byEventId'];

  constructor(private wsHelper: WorksheetHelper) {
    const parseResult = this.parseXlsx();
    this.byTicketId = parseResult.byTicketId;
    this.byEventId = parseResult.byEventId;
  }

  private parseXlsx() {
    const importHelper = new ImportHelper(this.wsHelper, { headerCol: 0 });

    const mappingSchema = {
      ticketId: {
        colIdx: importHelper.labelColumn('ticketId'),
        type: 'number',
      },
      eventId: {
        colIdx: importHelper.labelColumn('eventId'),
        type: 'number',
      },
      ticketName: {
        colIdx: importHelper.labelColumn('ticketName'),
        type: 'string',
      },
      count: {
        colIdx: importHelper.labelColumn('count'),
        type: 'number',
      },
      price: {
        colIdx: importHelper.labelColumn('price'),
        type: 'string',
      },
      paymentMethod: {
        colIdx: importHelper.labelColumn('paymentMethod'),
        type: 'string',
      },
    } as const;

    type Entry = MappingOutput<typeof mappingSchema>;
    const byTicketId = new Map<number, Entry>();
    const byEventId = new Map<number, Entry[]>();

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingSchema);

      byTicketId.set(entry.ticketId, entry);
      getMapValue(byEventId, entry.eventId).push(entry);
    }

    return {
      byTicketId,
      byEventId,
    };
  }

  ticketList(eventId: number): TicketEntry[] {
    const ticketList = this.byEventId.get(eventId) ?? [];
    return ticketList.map((entry) => {
      const { ticketId, eventId: _eventId, ...ticket } = entry;
      return ticket;
    });
  }
}
