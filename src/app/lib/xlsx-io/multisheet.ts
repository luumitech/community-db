export const worksheetNames = {
  community: 'Community',
  property: 'Property',
  occupant: 'Occupant',
  contact: 'Contact',
  membership: 'Membership',
  event: 'Event',
  ticket: 'Ticket',
} as const;

export interface WorksheetRows {
  community: CommunityRow[];
  property: PropertyRow[];
  occupant: OccupantRow[];
  contact: ContactRow[];
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
  geoapifySetting: string | null;
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
  /**
   * Number indicating if occupant is current or previous
   *
   * - 0: current occupant
   * - 1..n: past occupant list index
   */
  setIndex: number;
  startDate: string | null;
  endDate: string | null;
  firstName: string | null;
  lastName: string | null;
  optOut: number | undefined;
}

export interface ContactRow {
  contactId: number;
  occupantId: number;
  label: string | null;
  type: string | null;
  value: string | null;
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
