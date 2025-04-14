import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { OccupantEntry } from '../_type';
import { ImportHelper, type MappingOutput } from '../import-helper';
import { getMapValue } from './map-util';

export class OccupantUtil {
  private byOccupantId: ReturnType<typeof this.parseXlsx>['byOccupantId'];
  private byPropertyId: ReturnType<typeof this.parseXlsx>['byPropertyId'];

  constructor(private wsHelper: WorksheetHelper) {
    const parseResult = this.parseXlsx();
    this.byOccupantId = parseResult.byOccupantId;
    this.byPropertyId = parseResult.byPropertyId;
  }

  private parseXlsx() {
    const importHelper = new ImportHelper(this.wsHelper, { headerCol: 0 });

    const mappingSchema = {
      occupantId: {
        colIdx: importHelper.labelColumn('occupantId'),
        type: 'number',
      },
      propertyId: {
        colIdx: importHelper.labelColumn('propertyId'),
        type: 'number',
      },
      email: {
        colIdx: importHelper.labelColumn('email'),
        type: 'string',
      },
      firstName: {
        colIdx: importHelper.labelColumn('firstName'),
        type: 'string',
      },
      lastName: {
        colIdx: importHelper.labelColumn('lastName'),
        type: 'string',
      },
      optOut: {
        colIdx: importHelper.labelColumn('optOut'),
        type: 'boolean',
      },
      home: {
        colIdx: importHelper.labelColumn('home'),
        type: 'string',
      },
      work: {
        colIdx: importHelper.labelColumn('work'),
        type: 'string',
      },
      cell: {
        colIdx: importHelper.labelColumn('cell'),
        type: 'string',
      },
    } as const;

    type Entry = MappingOutput<typeof mappingSchema>;
    const byOccupantId = new Map<number, Entry>();
    const byPropertyId = new Map<number, Entry[]>();

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingSchema);

      byOccupantId.set(entry.occupantId, entry);
      getMapValue(byPropertyId, entry.propertyId).push(entry);
    }

    return {
      byOccupantId,
      byPropertyId,
    };
  }

  occupantList(propertyId: number): OccupantEntry[] {
    const occupantList = this.byPropertyId.get(propertyId) ?? [];
    return occupantList.map((entry) => {
      const { occupantId, propertyId: _propertyId, ...occupant } = entry;
      return occupant;
    });
  }
}
