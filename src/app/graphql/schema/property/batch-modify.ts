import { Community, Property, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import {
  communityMinMaxYearUpdateArgs,
  getCommunityEntry,
} from '../community/util';
import { EventInput } from './modify';
import {
  findOrAddEvent,
  mapEventEntry,
  propertyListFindManyArgs,
} from './util';

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
    withGps: t.boolean({
      description: 'Only property with GPS coordinates',
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
    self: t.field({ type: UpdateInput, required: true }),
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
      const { user, pubSub } = ctx;
      const { input } = args;
      const { self, filter } = input;
      const { eventAttended } = input.membership;
      const shortId = self.id;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      const community = await getCommunityEntry(user, shortId, {
        select: { id: true, minYear: true, maxYear: true },
      });

      const findManyArgs = await propertyListFindManyArgs(community.id, filter);
      const propertyList = await prisma.property.findMany(findManyArgs);

      // Modify the propertyList in memory, and then write them to
      // database afterwards
      propertyList.forEach(({ membershipList }) => {
        const result = findOrAddEvent(
          membershipList,
          input.membership.year,
          eventAttended.eventName
        );
        const membership = membershipList[result.membershipIdx];
        if (result.isNewEvent) {
          membership.eventAttendedList[result.eventIdx] =
            mapEventEntry(eventAttended);
        }
        if (result.isNewMember) {
          // Membership Fee will only be applied to properties
          // that do not have an existing membership
          membership.price = input.membership.price ?? null;
          membership.paymentMethod = input.membership.paymentMethod;
        } else if (membership.price == null) {
          // If a property has a Membership Fee entry, but does not have
          // Price information specified, the record will be updated with
          // the new Price information.
          membership.price = input.membership.price ?? null;
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
          messageType: MessageType.UPDATED,
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
