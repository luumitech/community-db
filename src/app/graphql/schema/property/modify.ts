import { ApolloError } from '@apollo/client';
import { Community, Prisma, Property, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MutationType } from '~/graphql/pubsub';
import { extractYearRange } from '~/lib/lcra-community/import/year-range-util';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import {
  communityMinMaxYearUpdateArgs,
  getCommunityEntry,
} from '../community/util';
import { getPropertyEntry, propertyListFindManyArgs } from './util';

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
    eventDate: t.string(),
    ticket: t.int(),
  }),
});

const MembershipInput = builder.inputType('MembershipInput', {
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
      const { user, pubSub } = await ctx;
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
        mutationType: MutationType.UPDATED,
        property: updatedProperty,
      });
      return {
        community: updatedCommunity,
        property: updatedProperty,
      };
    },
  })
);

export const PropertyFilterInput = builder.inputType('PropertyFilterInput', {
  fields: (t) => ({
    searchText: t.string({
      description: 'Match against property address/first name/last name',
    }),
    memberYear: t.int({
      description: 'Only property who is a member of the given year',
    }),
    nonMemberYear: t.int({
      description: 'Only property who is NOT a member of the given year',
    }),
    memberEvent: t.string({
      description: 'Only property who attended this event',
    }),
  }),
});

const BatchMembershipInput = builder.inputType('BatchMembershipInput', {
  fields: (t) => ({
    year: t.int({ required: true }),
    eventAttended: t.field({ type: EventInput, required: true }),
    paymentMethod: t.string({ required: true }),
    price: t.string(),
  }),
});

const BatchPropertyModifyInput = builder.inputType('BatchPropertyModifyInput', {
  fields: (t) => ({
    communityId: t.string({ required: true }),
    filter: t.field({ type: PropertyFilterInput }),
    membership: t.field({ type: BatchMembershipInput, required: true }),
  }),
});

interface BatchPropertyModifyPayload {
  community: Community;
  propertyList: Property[];
}

const batchPropertyModifyPayloadRef = builder
  .objectRef<BatchPropertyModifyPayload>('BatchPropertyModifyPayload')
  .implement({
    fields: (t) => ({
      community: t.prismaField({
        type: 'Community',
        resolve: (query, result, args, ctx) => result.community,
      }),
      propertyList: t.prismaField({
        type: ['Property'],
        resolve: (query, result, args, ctx) => result.propertyList,
      }),
    }),
  });

builder.mutationField('batchPropertyModify', (t) =>
  t.field({
    type: batchPropertyModifyPayloadRef,
    args: {
      input: t.arg({ type: BatchPropertyModifyInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = await ctx;
      const { input } = args;
      const { communityId: shortId, filter } = input;
      const { eventAttended } = input.membership;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      const community = await getCommunityEntry(user, shortId, {
        select: { id: true, minYear: true, maxYear: true },
      });

      const findManyArgs = await propertyListFindManyArgs(community.id, filter);
      const propertyList = await prisma.property.findMany(findManyArgs);

      // Modify the propertyList in memory, and then write them to
      // database afterwards
      propertyList.forEach((property) => {
        const membership = property.membershipList.find(
          (entry) => entry.year === input.membership.year
        );
        if (membership) {
          const event = membership.eventAttendedList.find(
            (entry) => entry.eventName === eventAttended.eventName
          );
          if (!event) {
            membership.eventAttendedList.push({
              eventName: eventAttended.eventName,
              eventDate: eventAttended.eventDate
                ? new Date(eventAttended.eventDate)
                : null,
              ticket: null,
            });
            // Non empty event list require payment Method
            if (membership.eventAttendedList.length === 1) {
              membership.paymentMethod = input.membership.paymentMethod;
            }
          }
        } else {
          property.membershipList.unshift({
            year: input.membership.year,
            paymentMethod: input.membership.paymentMethod,
            paymentDeposited: null,
            price: input.membership.price ?? null,
            eventAttendedList: [
              {
                eventName: eventAttended.eventName,
                eventDate: eventAttended.eventDate
                  ? new Date(eventAttended.eventDate)
                  : null,
                ticket: null,
              },
            ],
          });
        }
      });

      const communityUpdateDataArgs = communityMinMaxYearUpdateArgs(
        community,
        input.membership.year
      );

      const [updatedCommunity, ...updatedPropertyList] =
        await prisma.$transaction([
          // Update minYear/maxYear when appropriate
          communityUpdateDataArgs == null
            ? prisma.community.findUniqueOrThrow({
                where: { id: community.id },
              })
            : prisma.community.update({
                where: { id: community.id },
                data: communityUpdateDataArgs,
              }),
          ...propertyList.map((property) =>
            prisma.property.update({
              where: { id: property.id },
              data: {
                updatedBy: { connect: { email: user.email } },
                membershipList: property.membershipList,
              },
            })
          ),
        ]);

      // broadcast modification to property(s)
      updatedPropertyList.forEach((property) => {
        pubSub.publish(`community/${shortId}/property`, {
          broadcasterId: user.email,
          mutationType: MutationType.UPDATED,
          property,
        });
      });

      return {
        community: updatedCommunity,
        propertyList: updatedPropertyList,
      };
    },
  })
);
