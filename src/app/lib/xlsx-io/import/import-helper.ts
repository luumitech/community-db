import { type ContactInfoType } from '@prisma/client';
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
  contactInfoType: ContactInfoType;
}
type MappingType = keyof TypeMap;

/**
 * Provides a schema for specifying the type of each column
 *
 * For example:
 *
 * ```ts
 * const mappingSchema = {
 *   propertyId: 'number',
 *   address: 'string',
 *   streetNo: 'number',
 *   updatedAt: 'date',
 * } satisfies MappingTypeSchema;
 * ```
 */
export type MappingTypeSchema = Record<string, MappingType>;
export type MappingColIdxSchema<T extends MappingTypeSchema> = {
  /** Contains column index (0-based) that contains the value of the spreadsheet */
  [K in keyof T]: number;
};

/**
 * Result of calling `mapping` function
 *
 * Contains an object where each property contains the actual cell value in the
 * worksheet
 */
export type MappingResult<T extends MappingTypeSchema> = {
  [K in keyof T]: TypeMap[T[K]];
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
      case 'contactInfoType':
        return val as ContactInfoType;
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
  mapping<M extends MappingTypeSchema>(
    rowIdx: number,
    typeMapping: M,
    colIdxMapping: MappingColIdxSchema<M>
  ): MappingResult<M> {
    const allColIdxInvalid = Object.values(colIdxMapping).every(
      (colIdx) => colIdx === -1
    );
    if (allColIdxInvalid) {
      throw new GraphQLError('Unrecognized format');
    }

    const result = {
      ...R.pipe(
        typeMapping as MappingTypeSchema,
        R.mapValues((type, key) => {
          const val = this.cellAs(colIdxMapping[key], rowIdx, type);
          return val;
        }),
        // Remove fields with nullish value
        R.omitBy((val) => val == null)
      ),
    };
    // @ts-expect-error force into MappingResult type
    return result;
  }
}
