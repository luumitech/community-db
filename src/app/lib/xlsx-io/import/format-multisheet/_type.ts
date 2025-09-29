import { ContactUtil } from './contact-util';
import { EventUtil } from './event-util';
import { MembershipUtil } from './membership-util';
import { OccupantUtil } from './occupant-util';
import { PropertyUtil } from './property-util';
import { TicketUtil } from './ticket-util';

/** List of helper utilities passed to all the helper processor */
export interface UtilOpt {
  propertyUtil: PropertyUtil;
  occupantUtil: OccupantUtil;
  contactUtil: ContactUtil;
  membershipUtil: MembershipUtil;
  eventUtil: EventUtil;
  ticketUtil: TicketUtil;
}
