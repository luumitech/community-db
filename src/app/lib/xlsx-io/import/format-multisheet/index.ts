import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { worksheetNames } from '~/lib/xlsx-io/multisheet';
import { extractEventList } from '../event-list-util';
import { extractPaymentMethodList } from '../payment-method-list-util';
import { extractTicketList } from '../ticket-list-util';
import { extractYearRange } from '../year-range-util';
import { EventUtil } from './event-util';
import { MembershipUtil } from './membership-util';
import { OccupantUtil } from './occupant-util';
import { PropertyUtil } from './property-util';
import { TicketUtil } from './ticket-util';

/**
 * Import xlsx spreadsheet that is saved in the default format (i.e. multiple
 * worksheets)
 *
 * @param wb Xlsx workbook object
 * @returns List of properties with information
 */
export function importMultisheet(wb: XLSX.WorkBook) {
  const wsHelper = R.mapValues(worksheetNames, (wsName) => {
    return new WorksheetHelper(wb, wsName);
  });

  const propertyUtil = new PropertyUtil(wsHelper.property);
  const occupantUtil = new OccupantUtil(wsHelper.occupant);
  const membershipUtil = new MembershipUtil(wsHelper.membership);
  const eventUtil = new EventUtil(wsHelper.event);
  const ticketUtil = new TicketUtil(wsHelper.ticket);

  const propertyList = propertyUtil.propertyList({
    occupantUtil,
    membershipUtil,
    eventUtil,
    ticketUtil,
  });

  const eventNameList = extractEventList(propertyList);
  const paymentMethodList = extractPaymentMethodList(propertyList);
  const ticketList = extractTicketList(propertyList);
  const yearRange = extractYearRange(propertyList);

  return {
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
