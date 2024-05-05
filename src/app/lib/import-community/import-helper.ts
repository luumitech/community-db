import * as R from 'remeda';
import type { Event, Occupant, Property } from '~/graphql/generated/graphql';
import { WorksheetHelper } from '~/lib/worksheet-helper';

export interface ImportHelperConfig {
  /**
   * column containing header labels (row index, 0-based)
   */
  headerCol: number;
}

type MProperty = Omit<
  Property,
  '__typename' | 'id' | 'createdAt' | 'occupantList' | 'eventList'
>;
type MOccupant = Omit<Occupant, '__typename'>;
type MEvent = Omit<Event, '__typename' | 'year'>;

/**
 * Type of value being mapped (to be stored in database)
 */
type MappingType = 'string' | 'number' | 'date' | 'boolean';

interface MappingEntry {
  /**
   * Contains column index (0-based) that contains the value
   * of the spreadsheet
   */
  colIdx: number;
  type: MappingType;
}

type PropertyMapping = {
  [Key in keyof Required<MProperty>]: MappingEntry;
};

type OccupantMapping = {
  [Key in keyof Required<MOccupant>]: MappingEntry;
};

type EventMapping = {
  [Key in keyof Required<MEvent>]: MappingEntry;
};

export class ImportHelper {
  private headerLabels: string[] = [];

  constructor(
    public ws: WorksheetHelper,
    private cfg: ImportHelperConfig
  ) {
    for (const cell of this.ws.iterColumn(this.cfg.headerCol)) {
      if (typeof cell.v === 'string') {
        this.headerLabels.push(cell.v);
      } else {
        this.headerLabels.push('');
      }
    }
  }

  /**
   * Return value of a given cell,
   * undefined is value is not available
   */
  private cellValue(col: number, row: number) {
    if (col === -1) {
      return undefined;
    }
    const cell = this.ws.cell(col, row);
    if (cell.v == null) {
      return undefined;
    } else {
      return cell.v;
    }
  }

  /**
   * Return cell value and convert it to a given type
   */
  cellAs(col: number, row: number, type: 'string'): string | undefined;
  cellAs(col: number, row: number, type: 'number'): number | undefined;
  cellAs(col: number, row: number, type: 'boolean'): boolean | undefined;
  cellAs(col: number, row: number, type: 'date'): Date | undefined;
  cellAs(
    col: number,
    row: number,
    type: MappingType
  ): string | number | boolean | Date | undefined {
    const val = this.cellValue(col, row);
    if (val == null) {
      return undefined;
    }
    switch (type) {
      case 'string':
        return val.toString() || undefined;
      case 'number':
        if (typeof val !== 'number') {
          return parseFloat(val.toString());
        } else {
          return val;
        }
      case 'boolean':
        return !!val;
      case 'date':
        if (val instanceof Date) {
          return val;
        } else {
          const dateResult = new Date(val.toString());
          if (isNaN(+dateResult)) {
            return undefined;
          }
          return dateResult;
        }
      default:
        throw new Error(`invalid cell type ${type} specified`);
    }
  }

  /**
   * Return column index (0-based) corresponding with the given
   * header column label
   */
  labelColumn(label: string) {
    return this.headerLabels.findIndex((entry) => entry === label);
  }

  /**
   * Given the mapping information, read the property information
   * from the spreadsheet, and propagate the information into the
   * returned object
   */
  property(
    rowIdx: number,
    mapping: PropertyMapping
  ): Partial<MProperty> & Pick<Property, 'occupantList' | 'eventList'> {
    return {
      ...R.pipe(
        mapping,
        R.mapValues((entry, key) => {
          // @ts-expect-error: entry.type can be any of the supported type
          const val = this.cellAs(entry.colIdx, rowIdx, entry.type);
          return val;
        }),
        // Remove fields with nullish value
        R.omitBy((val, key) => val == null)
      ),
      occupantList: [],
      eventList: [],
    };
  }

  /**
   * Given the mapping information, read the occupant information
   * from the spreadsheet, and propagate the information into the
   * returned object
   */
  occupant(rowIdx: number, mapping: OccupantMapping): MOccupant {
    return {
      ...R.pipe(
        mapping,
        R.mapValues((entry, key) => {
          // @ts-expect-error: entry.type can be any of the supported type
          const val = this.cellAs(entry.colIdx, rowIdx, entry.type);
          return val;
        }),
        // Remove fields with nullish value
        R.omitBy((val, key) => val == null)
      ),
    };
  }

  /**
   * Given the mapping information, read the event information
   * from the spreadsheet, and propagate the information into the
   * returned object
   */
  event(rowIdx: number, mapping: EventMapping): MEvent {
    return {
      ...R.pipe(
        mapping,
        R.mapValues((entry, key) => {
          // @ts-expect-error: entry.type can be any of the supported type
          const val = this.cellAs(entry.colIdx, rowIdx, entry.type);
          return val;
        }),
        // Remove fields with nullish value
        R.omitBy((val, key) => val == null)
      ),
    };
  }
}
