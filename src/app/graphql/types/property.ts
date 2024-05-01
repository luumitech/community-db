import type { Event, Occupant } from '@prisma/client';
import { builder } from '../builder';

const Occupant = builder.objectRef<Occupant>('Occupant').implement({
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

const Event = builder.objectRef<Event>('Event').implement({
  fields: (t) => ({
    year: t.exposeInt('year'),
    isMember: t.exposeBoolean('isMember', { nullable: true }),
    eventAttended: t.exposeString('eventAttended', { nullable: true }),
    paymentDate: t.expose('paymentDate', { type: 'Date', nullable: true }),
    paymentMethod: t.exposeString('paymentMethod', { nullable: true }),
    paymentDeposited: t.exposeBoolean('paymentDeposited', { nullable: true }),
  }),
});

builder.prismaObject('Property', {
  fields: (t) => ({
    id: t.exposeID('id'),
    address: t.exposeString('address'),
    postalCode: t.exposeString('postalCode', { nullable: true }),
    notes: t.exposeString('notes', { nullable: true }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    updatedBy: t.exposeString('updatedBy', { nullable: true }),
    occupantList: t.field({
      type: [Occupant],
      select: {
        occupantList: true,
      },
      resolve: (entry) => entry.occupantList,
    }),
    eventList: t.field({
      type: [Event],
      select: {
        eventList: true,
      },
      resolve: (entry) => entry.eventList,
    }),
  }),
});
