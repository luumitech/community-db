import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { MembershipEntry } from '../_type';
import { ImportHelper, type MappingOutput } from '../import-helper';
import { EventUtil } from './event-util';
import { getMapValue } from './map-util';
import { TicketUtil } from './ticket-util';

export class MembershipUtil {
  private byMembershipId: ReturnType<typeof this.parseXlsx>['byMembershipId'];
  private byPropertyId: ReturnType<typeof this.parseXlsx>['byPropertyId'];

  constructor(private wsHelper: WorksheetHelper) {
    const parseResult = this.parseXlsx();
    this.byMembershipId = parseResult.byMembershipId;
    this.byPropertyId = parseResult.byPropertyId;
  }

  private parseXlsx() {
    const importHelper = new ImportHelper(this.wsHelper, { headerCol: 0 });

    const mappingSchema = {
      membershipId: {
        colIdx: importHelper.labelColumn('membershipId'),
        type: 'number',
      },
      propertyId: {
        colIdx: importHelper.labelColumn('propertyId'),
        type: 'number',
      },
      year: {
        colIdx: importHelper.labelColumn('year'),
        type: 'number',
      },
      paymentMethod: {
        colIdx: importHelper.labelColumn('paymentMethod'),
        type: 'string',
      },
      paymentDeposited: {
        colIdx: importHelper.labelColumn('paymentDeposited'),
        type: 'boolean',
      },
      price: {
        colIdx: importHelper.labelColumn('price'),
        type: 'string',
      },
    } as const;

    type Entry = MappingOutput<typeof mappingSchema>;
    const byMembershipId = new Map<number, Entry>();
    const byPropertyId = new Map<number, Entry[]>();

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingSchema);

      byMembershipId.set(entry.membershipId, entry);
      getMapValue(byPropertyId, entry.propertyId).push(entry);
    }

    return {
      byMembershipId,
      byPropertyId,
    };
  }

  membershipList(
    propertyId: number,
    opt: {
      eventUtil: EventUtil;
      ticketUtil: TicketUtil;
    }
  ): MembershipEntry[] {
    const membershipList = this.byPropertyId.get(propertyId) ?? [];
    return membershipList.map((entry) => {
      const { membershipId, propertyId: _propertyId, ...membership } = entry;
      return {
        ...membership,
        eventAttendedList: opt.eventUtil.eventAttendedList(membershipId, opt),
      };
    });
  }
}
