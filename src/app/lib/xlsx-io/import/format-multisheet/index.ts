import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { worksheetNames } from '~/lib/xlsx-io/multisheet';
import { CommunityUtil } from './community-util';
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
    try {
      return new WorksheetHelper(wb, wsName);
    } catch (err) {
      // If worksheet is missing, ignore it
    }
  });

  const propertyUtil = new PropertyUtil(wsHelper.property);
  const occupantUtil = new OccupantUtil(wsHelper.occupant);
  const membershipUtil = new MembershipUtil(wsHelper.membership);
  const eventUtil = new EventUtil(wsHelper.event);
  const ticketUtil = new TicketUtil(wsHelper.ticket);
  const communityUtil = new CommunityUtil(wsHelper.community);

  const communityCreateInput = communityUtil.communityCreateInput({
    propertyUtil,
    occupantUtil,
    membershipUtil,
    eventUtil,
    ticketUtil,
  });

  return communityCreateInput;
}
