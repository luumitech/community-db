import { Prisma } from '@prisma/client';

/**
 * Define types used during creation of community in Prisma
 *
 * Prisma create function accepts a wide variety of input, so we want to narrow
 * down the input types slightly, so it's easier to construct the necessary
 * create instructions
 */
export type TicketEntry = Prisma.TicketCreateInput;

export interface EventEntry extends Prisma.EventCreateInput {
  ticketList: TicketEntry[];
}

export interface MembershipEntry extends Prisma.MembershipCreateInput {
  eventAttendedList: EventEntry[];
}

export type OccupantEntry = Prisma.OccupantCreateInput;

export interface PropertyEntry
  extends Prisma.PropertyCreateWithoutCommunityInput {
  membershipList: MembershipEntry[];
  occupantList: OccupantEntry[];
}

export interface CommunityEntry extends Partial<Prisma.CommunityCreateInput> {
  propertyList: {
    create: PropertyEntry[];
  };
}
