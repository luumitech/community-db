export const worksheetNames = {
  property: 'Property',
  member: 'Member',
  membership: 'Membership',
  event: 'Event',
  ticket: 'Ticket',
};

export interface WorksheetRows {
  property: PropertyRow[];
  member: MemberRow[];
  membership: MembershipRow[];
  event: EventRow[];
  ticket: TicketRow[];
}

export interface PropertyRow {
  propertyId: number;
  address: string;
  streetNo: number | null;
  streetName: string | null;
  postalCode: string | null;
  notes: string | null;
  lastModDate: string | null;
  lastModBy: string | null;
}

export interface MemberRow {
  memberId: number;
  propertyId: number;
  firstName: string | null;
  lastName: string | null;
  optOut: number | undefined;
  email: string | null;
  home: string | null;
  work: string | null;
  cell: string | null;
}

export interface MembershipRow {
  membershipId: number;
  propertyId: number;
  year: number | null;
  isMember: number | undefined;
  payment: string | null;
  paymentDeposited: number | undefined;
}

export interface EventRow {
  eventId: number;
  membershipId: number;
  eventName: string | null;
  eventDate: string | null;
}

export interface TicketRow {
  ticketId: number;
  eventId: number;
  ticketName: string | null;
  count: number | null;
  price: string | null;
  paymentMethod: string | null;
}
