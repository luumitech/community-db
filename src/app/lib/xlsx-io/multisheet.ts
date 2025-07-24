export const worksheetNames = {
  community: 'Community',
  property: 'Property',
  occupant: 'Occupant',
  membership: 'Membership',
  event: 'Event',
  ticket: 'Ticket',
} as const;

export interface WorksheetRows {
  community: CommunityRow[];
  property: PropertyRow[];
  occupant: OccupantRow[];
  membership: MembershipRow[];
  event: EventRow[];
  ticket: TicketRow[];
}

export interface CommunityRow {
  name: string | null;
  defaultSetting: string | null;
  eventList: string | null;
  ticketList: string | null;
  paymentMethodList: string | null;
  mailchimpSetting: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface PropertyRow {
  propertyId: number;
  address: string;
  streetNo: number | null;
  streetName: string | null;
  postalCode: string | null;
  city: string | null;
  country: string | null;
  lat: string | null;
  lon: string | null;
  notes: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface OccupantRow {
  occupantId: number;
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
  price: string | null;
  paymentMethod: string | null;
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
