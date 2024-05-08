import type { Membership, Occupant } from '@prisma/client';
import { GraphQLError } from 'graphql';
import prisma from '../../lib/prisma';
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

const Membership = builder.objectRef<Membership>('Membership').implement({
  fields: (t) => ({
    year: t.exposeInt('year'),
    isMember: t.exposeBoolean('isMember', { nullable: true }),
    eventAttended: t.exposeString('eventAttended', { nullable: true }),
    paymentDate: t.expose('paymentDate', { type: 'Date', nullable: true }),
    paymentMethod: t.exposeString('paymentMethod', { nullable: true }),
    paymentDeposited: t.exposeBoolean('paymentDeposited', { nullable: true }),
  }),
});

export const propertyRef = builder.prismaObject('Property', {
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
    membershipList: t.field({
      type: [Membership],
      select: {
        membershipList: true,
      },
      resolve: (entry) => entry.membershipList,
    }),
  }),
});
