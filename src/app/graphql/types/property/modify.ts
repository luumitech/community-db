import { GraphQLError } from 'graphql';
import prisma from '../../../lib/prisma';
import { builder } from '../../builder';
import { MutationType } from '../../pubsub';
import { UpdateInput } from '../common';
import { getPropertyEntry } from './util';

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
      const { user, pubSub } = await ctx;
      const { self, ...input } = args.input;
      const shortId = self.id.toString();
      const entry = await getPropertyEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
          community: {
            select: {
              shortId: true,
            },
          },
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale property ${shortId}, please refresh browser.`
        );
      }

      const property = await prisma.property.update({
        ...query,
        where: {
          id: entry.id,
        },
        // @ts-expect-error: composite types like 'occupantList'
        // is allowed to be undefined
        data: {
          updatedBy: { connect: { email: user.email } },
          ...input,
        },
      });

      // broadcast modification to property
      pubSub.publish(`community/${entry.community.shortId}/property`, {
        broadcasterId: user.email,
        mutationType: MutationType.UPDATED,
        property,
      });
      return property;
    },
  })
);
