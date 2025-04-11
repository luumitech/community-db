import { isValidDate } from '~/lib/date-util';
import { type Community, type Property } from './community-data';

/** Export community using LCRA db format */
export abstract class ExportHelper {
  protected propertyList: Property[];

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

  constructor(protected community: Community) {
    this.propertyList = community.propertyList;
  }

  /** Convert a community from database to XLSX format (return buffer) */
  abstract toXlsx(): Buffer;
}
