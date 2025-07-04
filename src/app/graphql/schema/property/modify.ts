import { Community, Property, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
import { extractYearRange } from '~/lib/xlsx-io/import/year-range-util';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { communityMinMaxYearUpdateArgs } from '../community/util';
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

export const EventInput = builder.inputType('EventInput', {
  fields: (t) => ({
    eventName: t.string({ required: true }),
    eventDate: t.string(),
    ticketList: t.field({ type: [TicketInput] }),
  }),
});

const TicketInput = builder.inputType('TicketInput', {
  fields: (t) => ({
    ticketName: t.string({ required: true }),
    count: t.int(),
    price: t.string(),
    paymentMethod: t.string(),
  }),
});

export const MembershipInput = builder.inputType('MembershipInput', {
  fields: (t) => ({
    year: t.int({ required: true }),
    eventAttendedList: t.field({ type: [EventInput] }),
    paymentMethod: t.string(),
    price: t.string(),
  }),
});

const PropertyModifyInput = builder.inputType('PropertyModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    address: t.string(),
    streetNo: t.int(),
    streetName: t.string(),
    postalCode: t.string(),
    city: t.string(),
    country: t.string(),
    lat: t.string(),
    lon: t.string(),
    notes: t.string(),
    occupantList: t.field({ type: [OccupantInput] }),
    membershipList: t.field({ type: [MembershipInput] }),
  }),
});

interface PropertyModifyPayload {
  community: Community;
  property: Property;
}

const propertyModifyPayloadRef = builder
  .objectRef<PropertyModifyPayload>('PropertyModifyPayload')
  .implement({
    fields: (t) => ({
      community: t.prismaField({
        type: 'Community',
        resolve: (query, result, args, ctx) => result.community,
      }),
      property: t.prismaField({
        type: 'Property',
        resolve: (query, result, args, ctx) => result.property,
      }),
    }),
  });

builder.mutationField('propertyModify', (t) =>
  t.field({
    type: propertyModifyPayloadRef,
    args: {
      input: t.arg({ type: PropertyModifyInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const { self, ...input } = args.input;
      const shortId = self.id;

      const entry = await getPropertyEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
          community: {
            select: {
              id: true,
              shortId: true,
              minYear: true,
              maxYear: true,
            },
          },
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale property ${shortId}, please refresh browser.`
        );
      }

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId: entry.community.shortId }, [
        Role.ADMIN,
        Role.EDITOR,
      ]);

      // Check if community min/max year needs to be updated
      const yearRange = extractYearRange([input]);
      const communityUpdateDataArgs = communityMinMaxYearUpdateArgs(
        entry.community,
        yearRange.minYear,
        yearRange.maxYear
      );

      const [updatedCommunity, updatedProperty] = await prisma.$transaction([
        // Update community, if required
        communityUpdateDataArgs == null
          ? prisma.community.findUniqueOrThrow({
              where: { id: entry.community.id },
            })
          : prisma.community.update({
              where: { id: entry.community.id },
              data: communityUpdateDataArgs,
            }),

        // Update property
        prisma.property.update({
          where: {
            id: entry.id,
          },
          // @ts-expect-error: composite types like 'occupantList'
          // is allowed to be undefined
          data: {
            updatedBy: { connect: { email: user.email } },
            ...input,
          },
        }),
      ]);

      // broadcast modification to property
      pubSub.publish(`community/${entry.community.shortId}/property`, {
        broadcasterId: user.email,
        messageType: MessageType.UPDATED,
        property: updatedProperty,
      });
      return {
        community: updatedCommunity,
        property: updatedProperty,
      };
    },
  })
);
