import { ContactInfoType } from '@prisma/client';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { parseAsDate } from '~/lib/date-util';
import { insertIf } from '~/lib/insert-if';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import type {
  CommunityEntry,
  ContactInfoEntry,
  MembershipEntry,
  OccupantEntry,
  PropertyEntry,
} from '../_type';
import { extractEventList } from '../event-list-util';
import { ImportHelper } from '../import-helper';
import { extractPaymentMethodList } from '../payment-method-list-util';
import { extractTicketList } from '../ticket-list-util';
import { extractYearRange } from '../year-range-util';
import { parseTicketList } from './ticket-list-util';

/**
 * Import xlsx spreadsheet that is saved in LCRA format
 *
 * @param wb Xlsx workbook object
 * @returns List of properties with information
 */
export function importLcraDB(wb: XLSX.WorkBook): CommunityEntry {
  const wsHelper = WorksheetHelper.fromFirstSheet(wb);
  const importHelper = new ImportHelper(wsHelper, {
    headerCol: 0,
  });

  function addContactInfo(rowIdx: number, num: number): ContactInfoEntry[] {
    const { email, home, work, cell } = importHelper.mapping(
      rowIdx,
      {
        email: 'string',
        home: 'string',
        work: 'string',
        cell: 'string',
      },
      {
        email: importHelper.labelColumn(`EMail${num}`),
        home: importHelper.labelColumn(`HomePhone${num}`),
        work: importHelper.labelColumn(`WorkPhone${num}`),
        cell: importHelper.labelColumn(`CellPhone${num}`),
      }
    );

    const infoList: ContactInfoEntry[] = [
      ...insertIf(!!email, {
        type: ContactInfoType.EMAIL,
        label: 'email',
        value: email,
      }),
      ...insertIf(!!home, {
        type: ContactInfoType.PHONE,
        label: 'home',
        value: home,
      }),
      ...insertIf(!!work, {
        type: ContactInfoType.PHONE,
        label: 'work',
        value: work,
      }),
      ...insertIf(!!cell, {
        type: ContactInfoType.PHONE,
        label: 'cell',
        value: cell,
      }),
    ];

    return infoList;
  }

  function addOccupant(rowIdx: number, num: number): OccupantEntry {
    const occupant: OccupantEntry = importHelper.mapping(
      rowIdx,
      {
        firstName: 'string',
        lastName: 'string',
        optOut: 'boolean',
      },
      {
        firstName: importHelper.labelColumn(`FirstName${num}`),
        lastName: importHelper.labelColumn(`LastName${num}`),
        optOut: importHelper.labelColumn(`EMail${num}OptOut`),
      }
    );

    const infoList = addContactInfo(rowIdx, num);
    if (!R.isEmpty(infoList)) {
      occupant.infoList = infoList;
    }

    return occupant;
  }

  function addMembership(rowIdx: number, year: number): MembershipEntry {
    const prefix = `Y${year}`;
    const _membership = importHelper.mapping(
      rowIdx,
      {
        // isMember: 'boolean',
        eventNames: 'string',
        eventDates: 'string',
        eventTickets: 'string',
        paymentMethod: 'string',
        paymentDeposited: 'boolean',
        price: 'string',
      },
      {
        // isMember: importHelper.labelColumn(`${prefix}`),
        // event names separated by semi-colons
        eventNames: importHelper.labelColumn(`${prefix}-event`),
        // event dates separated by semi-colons
        eventDates: importHelper.labelColumn(`${prefix}-date`),
        eventTickets: importHelper.labelColumn(`${prefix}-ticket`),
        paymentMethod: importHelper.labelColumn(`${prefix}-payment`),
        paymentDeposited: importHelper.labelColumn(`${prefix}-deposited`),
        price: importHelper.labelColumn(`${prefix}-price`),
      }
    );
    // Map eventNameList/eventDateList into the format of
    // eventAttendedList
    const { eventNames, eventDates, eventTickets, ...membership } = _membership;
    const eventNameList = eventNames?.split(';') ?? [];
    const eventDateList = eventDates?.split(';') ?? [];
    const eventTicketList = eventTickets?.split(';') ?? [];
    const eventAttendedList = eventNameList.map((eventName, idx) => {
      // intepret date string as ZonedDateTime
      const eventDateObj = parseAsDate(eventDateList[idx]);
      const ticketList = parseTicketList(eventTicketList[idx]);
      return {
        eventName,
        eventDate: eventDateObj?.toDate() ?? null,
        ticketList,
      };
    });

    return {
      year: 2000 + year,
      ...membership,
      eventAttendedList,
    };
  }

  const propertyList: PropertyEntry[] = [];
  for (let rowIdx = 1; rowIdx < wsHelper.rowCount; rowIdx++) {
    const _property = importHelper.mapping(
      rowIdx,
      {
        address: 'string',
        streetNo: 'number',
        streetName: 'string',
        postalCode: 'string',
        notes: 'string',
        updatedAt: 'date',
        updatedByEmail: 'string',
      },
      {
        address: importHelper.labelColumn('Address'),
        streetNo: importHelper.labelColumn('StreetNo'),
        streetName: importHelper.labelColumn('StreetName'),
        postalCode: importHelper.labelColumn('PostalCode'),
        notes: importHelper.labelColumn('Notes'),
        updatedAt: importHelper.labelColumn('LastModDate'),
        updatedByEmail: importHelper.labelColumn('LastModBy'),
      }
    );

    // Map updatedByEmail into a user database document
    const { updatedByEmail, ...property } = _property;
    const updatedBy = updatedByEmail
      ? {
          connectOrCreate: {
            where: { email: updatedByEmail },
            create: { email: updatedByEmail },
          },
        }
      : undefined;

    // Determine total number of occupants by scanning the
    // column headers
    const occupantList: OccupantEntry[] = [];
    const occupantCount = importHelper.labelMatch(/^FirstName/).length;
    R.times(occupantCount, (occupantIdx) => {
      const occupant = addOccupant(rowIdx, occupantIdx + 1);
      if (!R.isEmpty(occupant)) {
        occupantList.push(occupant);
      }
    });

    // Determine total number of membership years by scanning the
    // column headers, and also sort it in descending order
    const yearList = importHelper
      .labelMatch(/^Y[\d]+$/)
      .map((yearStr) => parseInt(yearStr.slice(1), 10))
      .sort((a, b) => b - a);

    // The yearList should be array of number like
    // [24, 23, 22, ...]
    const membershipList: MembershipEntry[] = [];
    yearList.forEach((year) => {
      const membership = addMembership(rowIdx, year);
      if (!R.isEmpty(membership)) {
        membershipList.push(membership);
      }
    });

    propertyList.push({
      ...property,
      membershipList,
      occupancyInfoList: [{ occupantList }],
      ...(updatedBy && { updatedBy }),
    });
  }

  const eventNameList = extractEventList(propertyList);
  const paymentMethodList = extractPaymentMethodList(propertyList);
  const ticketList = extractTicketList(propertyList);
  const yearRange = extractYearRange(propertyList);

  return {
    name: wsHelper.sheetName,
    ...yearRange,
    eventList: eventNameList.map((eventName) => ({
      name: eventName,
      hidden: false,
    })),
    ticketList: ticketList.map((ticketName) => ({
      name: ticketName,
      hidden: false,
    })),
    paymentMethodList: paymentMethodList.map((method) => ({
      name: method,
      hidden: false,
    })),
    propertyList: {
      create: propertyList,
    },
  };
}
