import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { parseAsDate } from '~/lib/date-util';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { extractEventList } from './event-list-util';
import { ImportHelper } from './import-helper';
import { extractPaymentMethodList } from './payment-method-list-util';

/**
 * Import LCRA Database spreadsheet
 *
 * @param wb xlsx workbook object
 * @returns list of properties with information
 */
export function importLcraDB(wb: XLSX.WorkBook) {
  const wsHelper = WorksheetHelper.fromFirstSheet(wb);
  const importHelper = new ImportHelper(wsHelper, {
    headerCol: 0,
  });

  function addOccupant(rowIdx: number, num: number) {
    const occupant = importHelper.occupant(rowIdx, {
      firstName: {
        colIdx: importHelper.labelColumn(`FirstName${num}`),
        type: 'string',
      },
      lastName: {
        colIdx: importHelper.labelColumn(`LastName${num}`),
        type: 'string',
      },
      optOut: {
        colIdx: importHelper.labelColumn(`EMail${num}OptOut`),
        type: 'boolean',
      },
      email: {
        colIdx: importHelper.labelColumn(`EMail${num}`),
        type: 'string',
      },
      home: {
        colIdx: importHelper.labelColumn(`HomePhone${num}`),
        type: 'string',
      },
      work: {
        colIdx: importHelper.labelColumn(`WorkPhone${num}`),
        type: 'string',
      },
      cell: {
        colIdx: importHelper.labelColumn(`CellPhone${num}`),
        type: 'string',
      },
    });
    return occupant;
  }

  function addMembership(rowIdx: number, year: number) {
    const prefix = `Y${year}`;
    const _membership = importHelper.membership(rowIdx, {
      isMember: {
        colIdx: importHelper.labelColumn(`${prefix}`),
        type: 'boolean',
      },
      // event names separated by semi-colons
      eventNames: {
        colIdx: importHelper.labelColumn(`${prefix}-event`),
        type: 'string',
      },
      // event dates separated by semi-colons
      eventDates: {
        colIdx: importHelper.labelColumn(`${prefix}-date`),
        type: 'string',
      },
      paymentMethod: {
        colIdx: importHelper.labelColumn(`${prefix}-payment`),
        type: 'string',
      },
      paymentDeposited: {
        colIdx: importHelper.labelColumn(`${prefix}-deposited`),
        type: 'boolean',
      },
    });
    // Map eventNameList/eventDateList into the format of
    // eventAttendedList
    const { eventNames, eventDates, ...membership } = _membership;
    const eventNameList = eventNames?.split(';') ?? [];
    const eventDateList = eventDates?.split(';') ?? [];
    const eventAttendedList = eventNameList.map((eventName, idx) => {
      // intepret date string as CalendarDate
      const eventDateObj = parseAsDate(eventDateList[idx]);
      return {
        eventName,
        eventDate: eventDateObj ? eventDateObj.toDate('UTC') : null,
      };
    });

    return {
      year: 2000 + year,
      ...membership,
      eventAttendedList,
    };
  }

  const propertyList = [];
  for (let rowIdx = 1; rowIdx < wsHelper.rowCount; rowIdx++) {
    const _property = importHelper.property(rowIdx, {
      address: {
        colIdx: importHelper.labelColumn('Address'),
        type: 'string',
      },
      streetNo: {
        colIdx: importHelper.labelColumn('StreetNo'),
        type: 'string',
      },
      streetName: {
        colIdx: importHelper.labelColumn('StreetName'),
        type: 'string',
      },
      postalCode: {
        colIdx: importHelper.labelColumn('PostalCode'),
        type: 'string',
      },
      notes: {
        colIdx: importHelper.labelColumn('Notes'),
        type: 'string',
      },
      updatedAt: {
        colIdx: importHelper.labelColumn('LastModDate'),
        type: 'date',
      },
      updatedByEmail: {
        colIdx: importHelper.labelColumn('LastModBy'),
        type: 'string',
      },
    });
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
    const occupantCount = importHelper.labelMatch(/^FirstName/).length;
    R.times(occupantCount, (occupantIdx) => {
      const occupant = addOccupant(rowIdx, occupantIdx + 1);
      if (!R.isEmpty(occupant)) {
        property.occupantList.push(occupant);
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
    yearList.forEach((year) => {
      const membership = addMembership(rowIdx, year);
      if (!R.isEmpty(membership)) {
        property.membershipList.push(membership);
      }
    });

    propertyList.push({
      ...property,
      ...(updatedBy && { updatedBy }),
    });
  }

  const eventNameList = extractEventList(propertyList);
  const paymentMethodList = extractPaymentMethodList(propertyList);

  return {
    propertyList,
    eventList: eventNameList.map((eventName) => ({
      name: eventName,
      hidden: false,
    })),
    paymentMethodList: paymentMethodList.map((method) => ({
      name: method,
      hidden: false,
    })),
  };
}

/**
 * Data type returned from importLcraDB
 */
export type ImportResult = Awaited<ReturnType<typeof importLcraDB>>;
