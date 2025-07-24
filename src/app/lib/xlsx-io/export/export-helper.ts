import { isValidDate } from '~/lib/date-util';
import { type Community, type Property } from './community-data';

/** Export community helper */
export abstract class ExportHelper {
  /** Convert Date to xlsx cell value (ISO date string) */
  static toDate(input?: Date | null) {
    if (!isValidDate(input)) {
      return '';
    }
    return input.toISOString();
  }

  /**
   * Convert database boolean (true/false/null) to xlsx cell value
   * (1/0/undefined)
   */
  static toBool(input?: boolean | null) {
    if (input == null) {
      return undefined;
    }
    return input ? 1 : 0;
  }

  /** Convert database JSON to xlsx cell value */
  static toJson(input?: unknown) {
    if (input == null) {
      return null;
    }
    return JSON.stringify(input);
  }

  /** Initialize helper using community entry retrieved from database */
  constructor(
    protected community: Community,
    protected propertyList: Property[]
  ) {}

  /** Convert a community from database to XLSX format (return buffer) */
  abstract toXlsx(): Buffer;
}
