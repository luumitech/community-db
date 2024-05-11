import type { Membership, Occupant } from '@prisma/client';
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

const PropertyModifyInput = builder.inputType('PropertyModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    notes: t.string(),
    occupantList: t.field({ type: [OccupantInput], required: true }),
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

      const entry = prisma.property.update({
        ...query,
        where: {
          id: self.id.toString(),
          // Verify context user can modify document
          community: {
            accessList: {
              some: {
                user: {
                  email: user.email,
                },
              },
            },
          },
        },
        data: input,
      });
      return entry;
    },
  })
);
