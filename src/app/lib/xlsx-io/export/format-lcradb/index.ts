import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { isMember } from '~/graphql/schema/property/util';
import { ITEM_DELIMITER, removeDelimiter } from '~/lib/xlsx-io/delimiter-util';
import { toTicketList } from '../../import/format-lcradb/ticket-list-util';
import { type Community, type Property } from '../community-data';
import { ExportHelper } from '../export-helper';

/**
 * Export community using single sheet (aka LCRA DB format)
 *
 * This outputs a workbook with a single worksheet.
 *
 * - This is good for human consumption, as all nested fields are collapsed into a
 *   column
 */
export class ExportLcra extends ExportHelper {
  private maxOccupantCount = 0;
  private maxYear = 0;
  private minYear = Number.POSITIVE_INFINITY;

  constructor(protected community: Community) {
    super(community);
    // Find:
    // - maximum number of occupants in a property
    // - maximum year in membership list
    // - minimum year in membership list
    community.propertyList.forEach((property) => {
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
  createRow(property: Property) {
    const row: Record<string, unknown> = {
      Address: property.address,
      StreetNo: property.streetNo,
      StreetName: property.streetName,
      PostalCode: property.postalCode,
      Notes: property.notes,
      LastModDate: ExportHelper.toDate(property.updatedAt),
      LastModBy: property.updatedBy?.email,
    };

    R.range(0, this.maxOccupantCount).forEach((idx) => {
      const occupant = property.occupantList[idx];
      row[`FirstName${idx + 1}`] = occupant?.firstName;
      row[`LastName${idx + 1}`] = occupant?.lastName;
      row[`EMail${idx + 1}`] = occupant?.email;
      // row[`EMail${idx + 1}Facebook`] = undefined;
      row[`EMail${idx + 1}OptOut`] = ExportHelper.toBool(occupant?.optOut);
      row[`HomePhone${idx + 1}`] = occupant?.home;
      row[`WorkPhone${idx + 1}`] = occupant?.work;
      row[`CellPhone${idx + 1}`] = occupant?.cell;
    });

    row.LastModDate = ExportHelper.toDate(property.updatedAt);
    row.LastModBy = property.updatedBy?.email;
    row.Notes = property.notes;

    R.range(this.minYear, this.maxYear + 1)
      .reverse()
      .map((year) => {
        const membership = property.membershipList.find(
          (entry) => entry.year === year
        );
        const prfx = `Y${year - 2000}`;
        row[`${prfx}`] = ExportHelper.toBool(isMember(membership));
        row[`${prfx}-event`] = membership?.eventAttendedList
          .map((event) => removeDelimiter(event.eventName))
          .join(ITEM_DELIMITER);
        row[`${prfx}-date`] = membership?.eventAttendedList
          .map((event) => removeDelimiter(ExportHelper.toDate(event.eventDate)))
          .join(ITEM_DELIMITER);
        row[`${prfx}-ticket`] = membership?.eventAttendedList
          .map((event) => toTicketList(event.ticketList))
          .join(ITEM_DELIMITER);
        row[`${prfx}-payment`] = membership?.paymentMethod;
        row[`${prfx}-deposited`] = ExportHelper.toBool(
          membership?.paymentDeposited
        );
        row[`${prfx}-price`] = membership?.price;
      });

    return row;
  }

  /**
   * Get community as xlsx buffer
   *
   * @returns
   */
  public toXlsx() {
    const rows = this.propertyList.map((property) => this.createRow(property));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'membership');
    /**
     * For option descriptions See:
     * https://docs.sheetjs.com/docs/api/write-options
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
