import { isValidDate } from '~/lib/date-util';
import { type Property } from './community-data';

/** Export community using LCRA db format */
export abstract class ExportHelper {
  protected maxOccupantCount = 0;
  protected maxYear = 0;
  protected minYear = Number.POSITIVE_INFINITY;

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

  constructor(protected propertyList: Property[]) {
    // Find:
    // - maximum number of occupants in a property
    // - maximum year in membership list
    // - minimum year in membership list
    this.propertyList.forEach((property) => {
      this.maxOccupantCount = Math.max(
        property.occupantList.length,
        this.maxOccupantCount
      );
      property.membershipList.forEach((membership) => {
        this.maxYear = Math.max(membership.year, this.maxYear);
        this.minYear = Math.min(membership.year, this.minYear);
      });
    });
  }

  /**
   * Given a property from database, convert it into a row within the exported
   * xlsx
   */
  abstract createRow(property: Property): Record<string, unknown>;

  /** Convert a community from database to XLSX format (return buffer) */
  abstract toXlsx(): Buffer;
}
