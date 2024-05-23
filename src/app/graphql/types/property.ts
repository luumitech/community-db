import type { Event, Membership, Occupant } from '@prisma/client';
import { GraphQLError } from 'graphql';
import prisma from '../../lib/prisma';
import { builder } from '../builder';
import { UpdateInput } from './common';

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
    eventName: t.exposeString('eventName'),
    eventDate: t.expose('eventDate', { type: 'Date', nullable: true }),
  }),
});

const Membership = builder.objectRef<Membership>('Membership').implement({
  fields: (t) => ({
    year: t.exposeInt('year'),
    isMember: t.exposeBoolean('isMember', { nullable: true }),
    eventAttendedList: t.field({
      type: [Event],
      resolve: (entry) => entry.eventAttendedList,
    }),
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
      select: { occupantList: true },
      resolve: (entry) => entry.occupantList,
    }),
    membershipList: t.field({
      type: [Membership],
      select: { membershipList: true },
      resolve: (entry) => entry.membershipList,
    }),
  }),
});

const OccupantInput = builder.inputType('OccupantInput', {
  fields: (t) => ({
    firstName: t.string(),
    lastName: t.string(),
    optOut: t.boolean(),
    email: t.string(),
    cell: t.string(),
    work: t.string(),
    home: t.string(),
  }),
});

const EventInput = builder.inputType('EventInput', {
  fields: (t) => ({
    eventName: t.string({ required: true }),
    eventDate: t.string({ required: true }),
  }),
});

const MembershipInput = builder.inputType('MembershipInput', {
  fields: (t) => ({
    year: t.int({ required: true }),
    isMember: t.boolean(),
    eventAttendedList: t.field({ type: [EventInput] }),
    paymentMethod: t.string(),
    paymentDeposited: t.boolean(),
  }),
});

const PropertyModifyInput = builder.inputType('PropertyModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    notes: t.string(),
    occupantList: t.field({ type: [OccupantInput] }),
    membershipList: t.field({ type: [MembershipInput] }),
  }),
});

builder.mutationField('propertyModify', (t) =>
  t.prismaField({
    type: 'Property',
    args: {
      input: t.arg({ type: PropertyModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user } = await ctx;
      const { self, ...input } = args.input;
      const entry = await prisma.property.findUnique({
        ...query,
        where: {
          id: self.id.toString(),
          community: {
            accessList: {
              some: {
                user: { email: user.email },
              },
            },
          },
        },
        select: {
          updatedAt: true,
        },
      });
      if (!entry) {
        throw new GraphQLError(
          `No permission to access property ${self.id.toString()}`
        );
      } else if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale property ${self.id.toString()}, please refresh browser.`
        );
      }

      return prisma.property.update({
        ...query,
        where: {
          id: self.id.toString(),
        },
        // @ts-expect-error: composite types like 'occupantList'
        // is allowed to be undefined
        data: {
          updatedBy: user.email,
          ...input,
        },
      });
    },
  })
);
