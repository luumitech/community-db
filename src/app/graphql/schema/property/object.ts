import type {
  ContactInfo,
  Event,
  Membership,
  OccupancyInfo,
  Occupant,
  Ticket,
} from '@prisma/client';
import { builder } from '~/graphql/builder';
import { isMember } from './util';

export const contactInfoTypeRef = builder.enumType('ContactInfoType', {
  values: {
    EMAIL: {
      description: 'Email',
    },
    PHONE: {
      description: 'Phone number',
    },
    OTHER: {
      description: 'Other',
    },
  } as const,
});

const contactInfoRef = builder.objectRef<ContactInfo>('ContactInfo').implement({
  fields: (t) => ({
    type: t.field({
      type: contactInfoTypeRef,
      resolve: (entry) => entry.type,
    }),
    label: t.exposeString('label'),
    value: t.exposeString('value'),
  }),
});

const occupantRef = builder.objectRef<Occupant>('Occupant').implement({
  fields: (t) => ({
    firstName: t.exposeString('firstName', { nullable: true }),
    lastName: t.exposeString('lastName', { nullable: true }),
    optOut: t.exposeBoolean('optOut', { nullable: true }),
    infoList: t.field({
      type: [contactInfoRef],
      nullable: true,
      resolve: (entry) => entry.infoList,
    }),
  }),
});

const occupancyInfoRef = builder
  .objectRef<OccupancyInfo>('OccupancyInfo')
  .implement({
    fields: (t) => ({
      startDate: t.expose('startDate', {
        type: 'Date',
        nullable: true,
      }),
      endDate: t.expose('endDate', {
        type: 'Date',
        nullable: true,
      }),
      occupantList: t.field({
        type: [occupantRef],
        resolve: (entry) => entry.occupantList,
      }),
    }),
  });

const ticketRef = builder.objectRef<Ticket>('Ticket').implement({
  fields: (t) => ({
    ticketName: t.exposeString('ticketName'),
    count: t.exposeInt('count', { nullable: true }),
    price: t.exposeString('price', { nullable: true }),
    paymentMethod: t.exposeString('paymentMethod', { nullable: true }),
  }),
});

const eventRef = builder.objectRef<Event>('Event').implement({
  fields: (t) => ({
    eventName: t.exposeString('eventName'),
    eventDate: t.expose('eventDate', { type: 'Date', nullable: true }),
    ticketList: t.field({
      type: [ticketRef],
      resolve: (entry) => entry.ticketList,
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
    price: t.exposeString('price', { nullable: true }),
  }),
});

export const propertyRef = builder.prismaObject('Property', {
  fields: (t) => ({
    id: t.exposeString('shortId'),
    address: t.exposeString('address'),
    streetNo: t.exposeInt('streetNo', { nullable: true }),
    streetName: t.exposeString('streetName', { nullable: true }),
    postalCode: t.exposeString('postalCode', { nullable: true }),
    city: t.exposeString('city', { nullable: true }),
    country: t.exposeString('country', { nullable: true }),
    lat: t.exposeString('lat', { nullable: true }),
    lon: t.exposeString('lon', { nullable: true }),
    notes: t.exposeString('notes', { nullable: true }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.relation('updatedBy', { nullable: true }),
    occupantList: t.field({
      description: 'Current list of occupants',
      type: [occupantRef],
      select: { occupancyInfoList: true },
      resolve: (entry) => entry.occupancyInfoList?.[0]?.occupantList ?? [],
    }),
    occupancyInfoList: t.field({
      description: 'Occupancy info (current and previous occupants)',
      type: [occupancyInfoRef],
      select: { occupancyInfoList: true },
      resolve: (entry) => entry.occupancyInfoList,
    }),
    membershipList: t.field({
      description: 'Annual Membership information, sorted in descending order',
      type: [membershipRef],
      select: { membershipList: true },
      resolve: (entry) => entry.membershipList,
    }),
  }),
});
