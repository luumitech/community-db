import * as XLSX from 'xlsx';
import { isMember } from '~/graphql/schema/property/util';
import { worksheetNames, type WorksheetRows } from '~/lib/xlsx-io/multisheet';
import type {
  Community,
  Event,
  Membership,
  Occupant,
  Property,
  Ticket,
} from '../community-data';
import { ExportHelper } from '../export-helper';

/**
 * Export community using multiple sheets
 *
 * This outputs a workbook with multiple worksheets
 *
 * - Property
 * - Member
 * - Membership
 * - Event
 * - Ticket
 */
export class ExportMultisheet extends ExportHelper {
  private rows: WorksheetRows = {
    community: [],
    property: [],
    membership: [],
    occupant: [],
    event: [],
    ticket: [],
  };

  private processProperty(property: Property) {
    const propertyId = this.rows.property.length + 1;
    this.rows.property.push({
      propertyId,
      address: property.address,
      streetNo: property.streetNo,
      streetName: property.streetName,
      postalCode: property.postalCode,
      notes: property.notes,
      updatedAt: ExportHelper.toDate(property.updatedAt),
      updatedBy: property.updatedBy?.email ?? null,
    });
    property.occupantList.forEach((occupant) => {
      this.processMember(occupant, propertyId);
    });
    property.membershipList.forEach((membership) => {
      this.processMembership(membership, propertyId);
    });
  }

  private processMember(occupant: Occupant, propertyId: number) {
    const occupantId = this.rows.occupant.length + 1;
    this.rows.occupant.push({
      occupantId,
      propertyId,
      firstName: occupant.firstName,
      lastName: occupant.lastName,
      optOut: ExportHelper.toBool(occupant.optOut),
      email: occupant.email,
      home: occupant.home,
      work: occupant.work,
      cell: occupant.cell,
    });
  }

  private processMembership(membership: Membership, propertyId: number) {
    const membershipId = this.rows.membership.length + 1;
    this.rows.membership.push({
      membershipId,
      propertyId,
      year: membership.year,
      isMember: ExportHelper.toBool(isMember(membership)),
      paymentMethod: membership.paymentMethod,
      price: membership.price,
      paymentDeposited: ExportHelper.toBool(membership.paymentDeposited),
    });
    membership.eventAttendedList.forEach((event) => {
      this.processEvent(event, membershipId);
    });
  }

  private processEvent(event: Event, membershipId: number) {
    const eventId = this.rows.event.length + 1;
    this.rows.event.push({
      eventId,
      membershipId,
      eventName: event.eventName,
      eventDate: ExportHelper.toDate(event.eventDate),
    });
    event.ticketList.forEach((ticket) => {
      this.processTicket(ticket, eventId);
    });
  }

  private processTicket(ticket: Ticket, eventId: number) {
    const ticketId = this.rows.ticket.length + 1;
    this.rows.ticket.push({
      ticketId,
      eventId,
      ticketName: ticket.ticketName,
      count: ticket.count,
      price: ticket.price,
      paymentMethod: ticket.paymentMethod,
    });
  }

  private processCommunity(community: Community) {
    this.rows.community.push({
      name: community.name,
      defaultSetting: ExportHelper.toJson(community.defaultSetting),
      eventList: ExportHelper.toJson(community.eventList),
      ticketList: ExportHelper.toJson(community.ticketList),
      paymentMethodList: ExportHelper.toJson(community.paymentMethodList),
      mailchimpSetting: ExportHelper.toJson(community.mailchimpSetting),
      updatedAt: ExportHelper.toDate(community.updatedAt),
      updatedBy: community.updatedBy?.email ?? null,
    });
    community.propertyList.forEach((property) =>
      this.processProperty(property)
    );
  }

  /** Create workbook containing community data */
  private createWorkbook() {
    const workbook = XLSX.utils.book_new();
    this.processCommunity(this.community);

    Object.keys(worksheetNames).forEach((_key) => {
      const key = _key as keyof WorksheetRows;
      const worksheet = XLSX.utils.json_to_sheet(this.rows[key]);
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetNames[key]);
    });

    return workbook;
  }

  /**
   * Get community as xlsx buffer
   *
   * @returns
   */
  public toXlsx() {
    const workbook = this.createWorkbook();

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
