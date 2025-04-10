import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { isMember } from '~/graphql/schema/property/util';
import { ITEM_DELIMITER, removeDelimiter } from '~/lib/xlsx-io/delimiter-util';
import { toTicketList } from '~/lib/xlsx-io/import/format-lcradb/ticket-list-util';
import { type Property } from '../community-data';
import { ExportHelper } from '../export-helper';

/** Export community using LCRA db format */
export class ExportLcra extends ExportHelper {
  createRow(property: Property) {
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
