import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { OccupantEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { getMapValue } from './map-util';

const mappingType = {
  occupantId: 'number',
  propertyId: 'number',
  email: 'string',
  firstName: 'string',
  lastName: 'string',
  optOut: 'boolean',
  home: 'string',
  work: 'string',
  cell: 'string',
} satisfies MappingTypeSchema;
type MappingEntry = MappingResult<typeof mappingType>;

export class OccupantUtil {
  private byOccupantId = new Map<number, MappingEntry>();
  private byPropertyId = new Map<number, MappingEntry[]>();

  constructor(wsHelper?: WorksheetHelper) {
    if (wsHelper) {
      this.parseXlsx(wsHelper);
    }
  }

  private parseXlsx(wsHelper: WorksheetHelper) {
    const importHelper = new ImportHelper(wsHelper, { headerCol: 0 });

    const mappingColIdx: MappingColIdxSchema<typeof mappingType> = {
      occupantId: importHelper.labelColumn('occupantId'),
      propertyId: importHelper.labelColumn('propertyId'),
      email: importHelper.labelColumn('email'),
      firstName: importHelper.labelColumn('firstName'),
      lastName: importHelper.labelColumn('lastName'),
      optOut: importHelper.labelColumn('optOut'),
      home: importHelper.labelColumn('home'),
      work: importHelper.labelColumn('work'),
      cell: importHelper.labelColumn('cell'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byOccupantId.set(entry.occupantId, entry);
      getMapValue(this.byPropertyId, entry.propertyId).push(entry);
    }
  }

  occupantList(propertyId: number): OccupantEntry[] {
    const occupantList = this.byPropertyId.get(propertyId) ?? [];
    return occupantList.map((entry) => {
      const { occupantId, propertyId: _propertyId, ...occupant } = entry;
      return occupant;
    });
  }
}
