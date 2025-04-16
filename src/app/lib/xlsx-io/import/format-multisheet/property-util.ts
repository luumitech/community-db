import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { PropertyEntry } from '../_type';
import { ImportHelper, type MappingOutput } from '../import-helper';
import { EventUtil } from './event-util';
import { MembershipUtil } from './membership-util';
import { OccupantUtil } from './occupant-util';
import { TicketUtil } from './ticket-util';

export class PropertyUtil {
  private byPropertyId: ReturnType<typeof this.parseXlsx>['byPropertyId'];

  constructor(private wsHelper: WorksheetHelper) {
    const parseResult = this.parseXlsx();
    this.byPropertyId = parseResult.byPropertyId;
  }

  private parseXlsx() {
    const importHelper = new ImportHelper(this.wsHelper, { headerCol: 0 });

    const mappingSchema = {
      propertyId: {
        colIdx: importHelper.labelColumn('propertyId'),
        type: 'number',
      },
      address: {
        colIdx: importHelper.labelColumn('address'),
        type: 'string',
      },
      streetNo: {
        colIdx: importHelper.labelColumn('streetNo'),
        type: 'number',
      },
      streetName: {
        colIdx: importHelper.labelColumn('streetName'),
        type: 'string',
      },
      postalCode: {
        colIdx: importHelper.labelColumn('postalCode'),
        type: 'string',
      },
      notes: {
        colIdx: importHelper.labelColumn('notes'),
        type: 'string',
      },
      updatedAt: {
        colIdx: importHelper.labelColumn('updatedAt'),
        type: 'date',
      },
      updatedByEmail: {
        colIdx: importHelper.labelColumn('updatedBy'),
        type: 'string',
      },
    } as const;

    type Entry = MappingOutput<typeof mappingSchema>;
    const byPropertyId = new Map<number, Entry>();

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingSchema);

      byPropertyId.set(entry.propertyId, entry);
    }

    return {
      byPropertyId,
    };
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
