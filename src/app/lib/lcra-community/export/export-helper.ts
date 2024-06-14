import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { isValidDate } from '~/lib/date-util';
import { type Property } from './community-data';

/**
 * Convert Date to xlsx cell value (ISO date string)
 */
function toDate(input?: Date | null) {
  if (!isValidDate(input)) {
    return '';
  }
  return input.toISOString();
}

/**
 * Convert database boolean (true/false/null) to
 * xlsx cell value (1/0/undefined)
 */
function toBool(input?: boolean | null) {
  if (input == null) {
    return undefined;
  }
  return input ? 1 : 0;
}

/**
 * Export community using LCRA db format
 */
export class ExportHelper {
  private maxOccupantCount = 0;
  private maxYear = 0;
  private minYear = Number.POSITIVE_INFINITY;

  constructor(private propertyList: Property[]) {
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

  private createRow(property: Property) {
    const row: Record<string, unknown> = {
      Address: property.address,
      StreetNo: property.streetNo,
      StreetName: property.streetName,
      PostalCode: property.postalCode,
      LastModDate: property.updatedAt,
      LastModBy: property.updatedBy,
      Notes: property.notes,
    };

    R.range(0, this.maxOccupantCount).forEach((idx) => {
      const occupant = property.occupantList[idx];
      row[`FirstName${idx + 1}`] = occupant?.firstName;
      row[`LastName${idx + 1}`] = occupant?.lastName;
      row[`EMail${idx + 1}`] = occupant?.email;
      // row[`EMail${idx + 1}Facebook`] = undefined;
      row[`EMail${idx + 1}OptOut`] = toBool(occupant?.optOut);
      row[`HomePhone${idx + 1}`] = occupant?.home;
      row[`WorkPhone${idx + 1}`] = occupant?.work;
      row[`CellPhone${idx + 1}`] = occupant?.cell;
    });

    row.LastModDate = toDate(property.updatedAt);
    row.LastModBy = property.updatedBy?.email;
    row.Notes = property.notes;

    R.range(this.minYear, this.maxYear + 1)
      .reverse()
      .map((year) => {
        const membership = property.membershipList.find(
          (entry) => entry.year === year
        );
        const prfx = `Y${year - 2000}`;
        row[`${prfx}`] = toBool(membership?.isMember);
        row[`${prfx}-event`] = membership?.eventAttendedList
          .map((event) => event.eventName)
          .join(';');
        row[`${prfx}-date`] = membership?.eventAttendedList
          .map((event) => toDate(event.eventDate))
          .join(';');
        row[`${prfx}-payment`] = membership?.paymentMethod;
        row[`${prfx}-deposited`] = toBool(membership?.paymentDeposited);
      });

    return row;
  }

  /**
   * Get community as xlsx buffer
   * @returns
   */
  public toXlsx() {
    const rows = this.propertyList.map((property) => this.createRow(property));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'membership');
    /**
     * For option descriptions
     * See: https://docs.sheetjs.com/docs/api/write-options
     */
    const xlsxBuf: Buffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      bookSST: false,
      compression: true,
    });
    return xlsxBuf;
  }
}
