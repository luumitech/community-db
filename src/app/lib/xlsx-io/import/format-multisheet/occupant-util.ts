import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { OccupancyInfoEntry, OccupantEntry } from '../_type';
import {
  ImportHelper,
  type MappingColIdxSchema,
  type MappingResult,
  type MappingTypeSchema,
} from '../import-helper';
import { type UtilOpt } from './_type';
import { getMapValue } from './map-util';

const mappingType = {
  occupantId: 'number',
  propertyId: 'number',
  setIndex: 'number',
  firstName: 'string',
  lastName: 'string',
  optOut: 'boolean',
  startDate: 'date',
  endDate: 'date',
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
      setIndex: importHelper.labelColumn('setIndex'),
      firstName: importHelper.labelColumn('firstName'),
      lastName: importHelper.labelColumn('lastName'),
      optOut: importHelper.labelColumn('optOut'),
      startDate: importHelper.labelColumn('startDate'),
      endDate: importHelper.labelColumn('endDate'),
    };

    for (let rowIdx = 1; rowIdx < importHelper.ws.rowCount; rowIdx++) {
      const entry = importHelper.mapping(rowIdx, mappingType, mappingColIdx);

      this.byOccupantId.set(entry.occupantId, entry);
      getMapValue(this.byPropertyId, entry.propertyId).push(entry);
    }
  }

  /**
   * Separate by occupant list by setIndex, so it would be easy to construct the
   * occupancyInfoList
   */
  private getOccupantMapInfo(propertyId: number) {
    const excelRows = this.byPropertyId.get(propertyId) ?? [];
    const occupancyInfoMap = new Map<number, MappingEntry[]>();

    excelRows.forEach((entry) => {
      getMapValue(occupancyInfoMap, entry.setIndex ?? 0).push(entry);
    });
    return occupancyInfoMap;
  }

  private toOccupantEntry(entry: MappingEntry, opt: UtilOpt): OccupantEntry {
    const {
      occupantId,
      propertyId: _propertyId,
      setIndex,
      startDate,
      endDate,
      ...occupant
    } = entry;
    return {
      ...occupant,
      infoList: opt.contactUtil.contactList(occupantId, opt),
    };
  }

  occupancyInfoList(propertyId: number, opt: UtilOpt) {
    const occupancyInfoMap = this.getOccupantMapInfo(propertyId);
    const occupancyInfoList: OccupancyInfoEntry[] = new Array(
      occupancyInfoMap.size
    );

    for (const [setIndex, list] of occupancyInfoMap) {
      occupancyInfoList[setIndex] = {
        startDate: list.find(({ startDate }) => startDate)?.startDate,
        endDate: list.find(({ endDate }) => endDate)?.endDate,
        occupantList: list.map((entry) => this.toOccupantEntry(entry, opt)),
      };
    }

    return occupancyInfoList;
  }
}
