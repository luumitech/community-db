import type { Event, Membership, Occupant } from '@prisma/client';
import { builder } from '~/graphql/builder';
import { isMember } from './util';

const occupantRef = builder.objectRef<Occupant>('Occupant').implement({
  fields: (t) => ({
    firstName: t.exposeString('firstName', { nullable: true }),
    lastName: t.exposeString('lastName', { nullable: true }),
    optOut: t.exposeBoolean('optOut', { nullable: true }),
    email: t.exposeString('email', { nullable: true }),
    cell: t.exposeString('cell', { nullable: true }),
    work: t.exposeString('work', { nullable: true }),
    home: t.exposeString('home', { nullable: true }),
  }),
});

const eventRef = builder.objectRef<Event>('Event').implement({
  fields: (t) => ({
    eventName: t.exposeString('eventName'),
    eventDate: t.expose('eventDate', { type: 'Date', nullable: true }),
    ticket: t.field({
      type: 'Int',
      description: 'Number of tickets given for the event',
      resolve: (entry) => entry.ticket ?? 0,
    }),
  }),
});

const membershipRef = builder.objectRef<Membership>('Membership').implement({
  fields: (t) => ({
    year: t.exposeInt('year'),
    isMember: t.field({
      type: 'Boolean',
      resolve: (entry) => isMember(entry),
    }),
    eventAttendedList: t.field({
      type: [eventRef],
      resolve: (entry) => entry.eventAttendedList,
    }),
    paymentMethod: t.exposeString('paymentMethod', { nullable: true }),
    paymentDeposited: t.exposeBoolean('paymentDeposited', { nullable: true }),
  }),
});

export const propertyRef = builder.prismaObject('Property', {
  fields: (t) => ({
    id: t.exposeString('shortId'),
    address: t.exposeString('address'),
    streetNo: t.exposeString('streetNo', { nullable: true }),
    streetName: t.exposeString('streetName', { nullable: true }),
    postalCode: t.exposeString('postalCode', { nullable: true }),
    notes: t.exposeString('notes', { nullable: true }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.relation('updatedBy', { nullable: true }),
    occupantList: t.field({
      type: [occupantRef],
      select: { occupantList: true },
      resolve: (entry) => entry.occupantList,
    }),
    membershipList: t.field({
      description: 'Annual Membership information, sorted in descending order',
      type: [membershipRef],
      select: { membershipList: true },
      resolve: (entry) => entry.membershipList,
    }),
  }),
});
