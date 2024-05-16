import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { ImportHelper } from './import-helper';

/**
 * Import LCRA Database spreadsheet
 *
 * @param wb xlsx workbook object
 * @returns list of properties with information
 */
export function importLcraDB(wb: XLSX.WorkBook) {
  const wsHelper = new WorksheetHelper(wb, 'LCRA membership');
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
    const membership = importHelper.membership(rowIdx, {
      isMember: {
        colIdx: importHelper.labelColumn(`${prefix}`),
        type: 'boolean',
      },
      eventsAttended: {
        colIdx: importHelper.labelColumn(`${prefix}-event`),
        type: 'string',
      },
      paymentDate: {
        colIdx: importHelper.labelColumn(`${prefix}-date`),
        type: 'date',
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
    return {
      year: 2000 + year,
      ...membership,
    };
  }

  const propertyList = [];
  for (let rowIdx = 1; rowIdx < wsHelper.rowCount; rowIdx++) {
    const property = importHelper.property(rowIdx, {
      address: {
        colIdx: importHelper.labelColumn('Address'),
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
      updatedBy: {
        colIdx: importHelper.labelColumn('LastModBy'),
        type: 'string',
      },
    });

    // support 4 different occupants
    R.times(4, (occupantIdx) => {
      const occupant = addOccupant(rowIdx, occupantIdx);
      if (!R.isEmpty(occupant)) {
        property.occupantList.push(occupant);
      }
    });

    // support Y2 to Y24
    R.range(2, 25).forEach((year) => {
      const membership = addMembership(rowIdx, year);
      if (!R.isEmpty(membership)) {
        property.membershipList.push(membership);
      }
    });

    propertyList.push(property);
  }

  return propertyList;
}
