import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { PropertyEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { EventUtil } from './event-util';
import { MembershipUtil } from './membership-util';
import { OccupantUtil } from './occupant-util';
import { TicketUtil } from './ticket-util';

const mappingType = {
  propertyId: 'number',
  address: 'string',
  streetNo: 'number',
  streetName: 'string',
  postalCode: 'string',
  notes: 'string',
  updatedAt: 'date',
  updatedByEmail: 'string',
} satisfies MappingTypeSchema;
type MappingEntry = MappingResult<typeof mappingType>;

export class PropertyUtil {
  private byPropertyId = new Map<number, MappingEntry>();

  constructor(wsHelper?: WorksheetHelper) {
    if (wsHelper) {
      this.parseXlsx(wsHelper);
    }
  }

  private parseXlsx(wsHelper: WorksheetHelper) {
    const importHelper = new ImportHelper(wsHelper, { headerCol: 0 });

    const mappingColIdx: MappingColIdxSchema<typeof mappingType> = {
      propertyId: importHelper.labelColumn('propertyId'),
      address: importHelper.labelColumn('address'),
      streetNo: importHelper.labelColumn('streetNo'),
      streetName: importHelper.labelColumn('streetName'),
      postalCode: importHelper.labelColumn('postalCode'),
      notes: importHelper.labelColumn('notes'),
      updatedAt: importHelper.labelColumn('updatedAt'),
      updatedByEmail: importHelper.labelColumn('updatedBy'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byPropertyId.set(entry.propertyId, entry);
    }
  }

  propertyList(opt: {
    occupantUtil: OccupantUtil;
    membershipUtil: MembershipUtil;
    eventUtil: EventUtil;
    ticketUtil: TicketUtil;
  }): PropertyEntry[] {
    const propertyList = [...this.byPropertyId.values()];
    return propertyList.map((entry) => {
      const { updatedByEmail, propertyId, ...property } = entry;
      const updatedBy = updatedByEmail
        ? {
            connectOrCreate: {
              where: { email: updatedByEmail },
              create: { email: updatedByEmail },
            },
          }
        : undefined;

      return {
        ...property,
        occupantList: opt.occupantUtil.occupantList(propertyId),
        membershipList: opt.membershipUtil.membershipList(propertyId, opt),
        ...(updatedBy && { updatedBy }),
      };
    });
  }
}
