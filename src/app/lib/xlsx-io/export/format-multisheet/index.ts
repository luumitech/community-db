import * as XLSX from 'xlsx';
import { isMember } from '~/graphql/schema/property/util';
import { type GeocodeResult } from '~/lib/geoapify-api/resource';
import { worksheetNames, type WorksheetRows } from '~/lib/xlsx-io/multisheet';
import type {
  Community,
  ContactInfo,
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
    contact: [],
    event: [],
    ticket: [],
  };

  private processProperty(property: Property) {
    const propertyId = this.rows.property.length + 1;
    this.rows.property.push({
      propertyId,
      address: property.address,
      streetNo: property.streetNo ?? null,
      streetName: property.streetName ?? null,
      postalCode: property.postalCode ?? null,
      city: property.city ?? null,
      country: property.country ?? null,
      lat: property.lat ?? null,
      lon: property.lon ?? null,
      notes: property.notes ?? null,
      updatedAt: ExportHelper.toDate(property.updatedAt),
      updatedBy: property.updatedBy?.email ?? null,
    });
    property.occupantList.forEach((occupant, idx) => {
      this.processMember(occupant, propertyId, {
        setIndex: -1,
        /**
         * Within the same setIndex, only the first entry needs to record
         * start/end date
         */
        ...(idx === 0 && {
          startDate: property.occupantStartDate,
        }),
      });
    });
    property.pastOccupantList?.forEach((occupantInfo, setIndex) => {
      occupantInfo.occupantList.forEach((occupant, idx) => {
        this.processMember(occupant, propertyId, {
          setIndex,
          /**
           * Within the same setIndex, only the first entry needs to record
           * start/end date
           */
          ...(idx === 0 && {
            startDate: occupantInfo.startDate,
            endDate: occupantInfo.endDate,
          }),
        });
      });
    });
    property.membershipList.forEach((membership) => {
      this.processMembership(membership, propertyId);
    });
  }

  private processContact(contact: ContactInfo, occupantId: number) {
    const contactId = this.rows.contact.length + 1;
    this.rows.contact.push({
      contactId,
      occupantId,
      type: contact.type,
      label: contact.label,
      value: contact.value,
    });
  }

  private processMember(
    occupant: Occupant,
    propertyId: number,
    opt: {
      setIndex: number;
      startDate?: Date | null;
      endDate?: Date | null;
    }
  ) {
    const occupantId = this.rows.occupant.length + 1;
    this.rows.occupant.push({
      occupantId,
      propertyId,
      setIndex: opt?.setIndex ?? -1,
      firstName: occupant.firstName ?? null,
      lastName: occupant.lastName ?? null,
      optOut: ExportHelper.toBool(occupant.optOut),
      startDate: ExportHelper.toDate(opt?.startDate),
      endDate: ExportHelper.toDate(opt?.endDate),
    });
    occupant.infoList.forEach((contact) => {
      this.processContact(contact, occupantId);
    });
  }

  private processMembership(membership: Membership, propertyId: number) {
    const membershipId = this.rows.membership.length + 1;
    this.rows.membership.push({
      membershipId,
      propertyId,
      year: membership.year ?? null,
      isMember: ExportHelper.toBool(isMember(membership)),
      paymentMethod: membership.paymentMethod ?? null,
      price: membership.price ?? null,
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
      eventName: event.eventName ?? null,
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
      ticketName: ticket.ticketName ?? null,
      count: ticket.count ?? null,
      price: ticket.price ?? null,
      paymentMethod: ticket.paymentMethod ?? null,
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
      geoapifySetting: ExportHelper.toJson(community.geoapifySetting),
      updatedAt: ExportHelper.toDate(community.updatedAt),
      updatedBy: community.updatedBy?.email ?? null,
    });
  }

  /** Create workbook containing community data */
  public createWorkbook() {
    const workbook = XLSX.utils.book_new();
    this.processCommunity(this.community);
    /**
     * NOTE: we don't use the propertyList from `this.community` because
     * `this.community` may not be extracted from database directly.
     *
     * For the purpose of export, we only use a subset of properties from the
     * database, so we want to cater for other methods of `propertyList`
     * creation. For example, when importing via geodata (from Method.Map), the
     * propertyList is created manually.
     */

    this.propertyList.forEach((property) => this.processProperty(property));

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
   * @returns Xlsx formatted buffer
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

  /**
   * Leverage format-multisheet to create a worksheet that contains all property
   * information stored in Geoapify result
   */
  static fromGeoResult(communityName: string, input: GeocodeResult[]) {
    const community: Community = {
      name: communityName,
      eventList: [],
      ticketList: [],
      paymentMethodList: [],
      propertyList: [],
    };

    const propertyList: Property[] = input.map((entry) => ({
      address: entry.address_line1,
      streetNo: parseInt(entry.housenumber, 10) ?? 0,
      streetName: entry.street,
      postalCode: entry.postcode,
      city: entry.city,
      country: entry.country,
      lat: entry.lat?.toString() ?? null,
      lon: entry.lon?.toString() ?? null,
      occupantList: [],
      membershipList: [],
    }));

    return new ExportMultisheet(community, propertyList);
  }
}
