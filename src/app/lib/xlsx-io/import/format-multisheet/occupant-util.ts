import { P } from 'pino';
import * as R from 'remeda';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import type { OccupantEntry, PastOccupantEntry } from '../_type';
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
   * occupantList for current and past
   */
  private getOccupantMapInfo(propertyId: number) {
    const excelRows = this.byPropertyId.get(propertyId) ?? [];
    const current: MappingEntry[] = [];
    const past = new Map<number, MappingEntry[]>();

    excelRows.forEach((entry) => {
      if (entry.setIndex === -1) {
        current.push(entry);
      } else {
        getMapValue(past, entry.setIndex).push(entry);
      }
    });
    return { current, past };
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

  occupantInfo(propertyId: number, opt: UtilOpt) {
    const { current, past } = this.getOccupantMapInfo(propertyId);

    const occupantStartDate = current.find(
      ({ startDate }) => startDate
    )?.startDate;
    const occupantList = current.map((entry) =>
      this.toOccupantEntry(entry, opt)
    );

    const pastOccupantList: PastOccupantEntry[] = [];
    past.forEach((list, setIndex) => {
      pastOccupantList.push({
        startDate: list.find(({ startDate }) => startDate)?.startDate,
        endDate: list.find(({ endDate }) => endDate)?.endDate,
        occupantList: list.map((entry) => this.toOccupantEntry(entry, opt)),
      });
    });

    return {
      occupantStartDate,
      occupantList,
      pastOccupantList,
    };
  }
}
