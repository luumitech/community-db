import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { MembershipEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { EventUtil } from './event-util';
import { getMapValue } from './map-util';
import { TicketUtil } from './ticket-util';

const mappingType = {
  membershipId: 'number',
  propertyId: 'number',
  year: 'number',
  paymentMethod: 'string',
  paymentDeposited: 'boolean',
  price: 'string',
} satisfies MappingTypeSchema;
type MappingEntry = MappingResult<typeof mappingType>;

export class MembershipUtil {
  private byMembershipId = new Map<number, MappingEntry>();
  private byPropertyId = new Map<number, MappingEntry[]>();

  constructor(wsHelper?: WorksheetHelper) {
    if (wsHelper) {
      this.parseXlsx(wsHelper);
    }
  }

  private parseXlsx(wsHelper: WorksheetHelper) {
    const importHelper = new ImportHelper(wsHelper, { headerCol: 0 });

    const mappingColIdx: MappingColIdxSchema<typeof mappingType> = {
      membershipId: importHelper.labelColumn('membershipId'),
      propertyId: importHelper.labelColumn('propertyId'),
      year: importHelper.labelColumn('year'),
      paymentMethod: importHelper.labelColumn('paymentMethod'),
      paymentDeposited: importHelper.labelColumn('paymentDeposited'),
      price: importHelper.labelColumn('price'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byMembershipId.set(entry.membershipId, entry);
      getMapValue(this.byPropertyId, entry.propertyId).push(entry);
    }
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
