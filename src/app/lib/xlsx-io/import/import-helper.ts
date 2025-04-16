import { GraphQLError } from 'graphql';
import * as R from 'remeda';
import { isValidDate } from '~/lib/date-util';
import { parseAsNumber } from '~/lib/number-util';
import { WorksheetHelper } from '~/lib/worksheet-helper';

export interface ImportHelperConfig {
  /** Column containing header labels (row index, 0-based) */
  headerCol: number;
}

/**
 * List of types available during mapping process
 *
 * The goal of ImportHelper is to parse the xlsx cell value to a type that is
 * suitable for saving into the Prisma database
 */
interface TypeMap {
  string: string;
  number: number;
  date: Date;
  boolean: boolean;
}
type MappingType = keyof TypeMap;

/**
 * We assume each column in xlsx are translated into a particular javascript
 * type
 */
interface MappingEntry {
  /** Contains column index (0-based) that contains the value of the spreadsheet */
  colIdx: number;
  type: MappingType;
}

/**
 * For defining a list of Mapping entries for each column in xlsx
 *
 * For example, if column B in xlsx corresponds to a boolean to be saved in
 * Prisma as field 'optOut', then:
 *
 * ```js
 * {
 *   "optOut": {
 *     "colIdx": 1,
 *     "type": "boolean"
 *   }
 * }
 * ```
 */
type Mapping = Record<string, MappingEntry>;

/** The output of mapping function */
export type MappingOutput<T extends Mapping> = {
  [K in keyof T]: T[K] extends { type: infer R }
    ? R extends keyof TypeMap
      ? TypeMap[R]
      : never
    : never;
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

  /** Return value of a given cell, undefined is value is not available */
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

  /** Return cell value and convert it to a given type */
  cellAs(
    col: number,
    row: number,
    type: MappingType
  ): TypeMap[MappingType] | null {
    const val = this.cellValue(col, row);
    if (val == null) {
      return null;
    }
    switch (type) {
      case 'string':
        return val.toString() || null;
      case 'number':
        if (typeof val !== 'number') {
          return parseAsNumber(val.toString());
        } else {
          return val;
        }
      case 'boolean':
        return !!val;
      case 'date':
        if (isValidDate(val as Date)) {
          return val;
        } else {
          const dateResult = new Date(val.toString());
          if (!isValidDate(dateResult)) {
            return null;
          }
          return dateResult;
        }
      default:
        throw new GraphQLError(`invalid cell type ${type} specified`);
    }
  }

  /**
   * Return column index (0-based) corresponding with the given header column
   * label
   */
  labelColumn(label: string) {
    return this.headerLabels.findIndex((entry) => entry === label);
  }

  /** Return all header column labels that matches the given regex */
  labelMatch(regex: RegExp) {
    return this.headerLabels.filter((entry) => entry.match(regex));
  }

  /**
   * Given the mapping information, read the property information from the
   * spreadsheet, and propagate the information into the returned object
   */
  mapping<T extends Mapping>(rowIdx: number, mapping: T): MappingOutput<T> {
    const allColIdxInvalid = Object.values(mapping).every(
      ({ colIdx }) => colIdx === -1
    );
    if (allColIdxInvalid) {
      throw new GraphQLError('Unrecognized format');
    }

    const result = {
      ...R.pipe(
        mapping as Mapping,
        R.mapValues((entry) => {
          const val = this.cellAs(entry.colIdx, rowIdx, entry.type);
          return val;
        }),
        // Remove fields with nullish value
        R.omitBy((val) => val == null)
      ),
    };
    // @ts-expect-error force into MappingOutput type
    return result;
  }
}
