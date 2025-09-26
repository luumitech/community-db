import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { PropertyEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { type UtilOpt } from './_type';

const mappingType = {
  propertyId: 'number',
  address: 'string',
  streetNo: 'number',
  streetName: 'string',
  postalCode: 'string',
  city: 'string',
  country: 'string',
  lat: 'string',
  lon: 'string',
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
      city: importHelper.labelColumn('city'),
      country: importHelper.labelColumn('country'),
      lat: importHelper.labelColumn('lat'),
      lon: importHelper.labelColumn('lon'),
      notes: importHelper.labelColumn('notes'),
      updatedAt: importHelper.labelColumn('updatedAt'),
      updatedByEmail: importHelper.labelColumn('updatedBy'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byPropertyId.set(entry.propertyId, entry);
    }
  }

  propertyList(opt: UtilOpt): PropertyEntry[] {
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
        occupantList: opt.occupantUtil.occupantList(propertyId, opt),
        membershipList: opt.membershipUtil.membershipList(propertyId, opt),
        ...(updatedBy && { updatedBy }),
      };
    });
  }
}
