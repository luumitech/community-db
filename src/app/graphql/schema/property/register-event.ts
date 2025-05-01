import { Community, Property, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import prisma from '~/lib/prisma';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { communityMinMaxYearUpdateArgs } from '../community/util';
import { EventInput } from './modify';
import { findOrAddEvent, getPropertyEntry, mapEventEntry } from './util';

const RegisterEventMembershipInput = builder.inputType(
  'RegisterEventMembershipInput',
  {
    fields: (t) => ({
      year: t.int({ required: true }),
      price: t.string(),
      paymentMethod: t.string({ required: true }),
    }),
  }
);

const RegisterEventInput = builder.inputType('RegisterEventInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    notes: t.string(),
    membership: t.field({ type: RegisterEventMembershipInput, required: true }),
    event: t.field({ type: EventInput, required: true }),
  }),
});

interface RegisterEventPayload {
  community: Community;
  property: Property;
}

const registerEventPayloadRef = builder
  .objectRef<RegisterEventPayload>('RegisterEventPayload')
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

builder.mutationField('registerEvent', (t) =>
  t.field({
    type: registerEventPayloadRef,
    args: {
      input: t.arg({ type: RegisterEventInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const {
        self,
        event: eventInput,
        membership: membershipInput,
        ...input
      } = args.input;
      const shortId = self.id;

      const entry = await getPropertyEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
          membershipList: true,
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
      const communityUpdateDataArgs = communityMinMaxYearUpdateArgs(
        entry.community,
        membershipInput.year
      );

      const result = findOrAddEvent(
        entry.membershipList,
        membershipInput.year,
        eventInput.eventName
      );
      const membership = entry.membershipList[result.membershipIdx];
      membership.price = membershipInput.price ?? null;
      membership.paymentMethod = membershipInput.paymentMethod ?? null;

      // Update event and ticketList information
      const newEvent = mapEventEntry(eventInput);
      const event = membership.eventAttendedList[result.eventIdx];
      event.eventDate = newEvent.eventDate;
      event.ticketList.push(...newEvent.ticketList);

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
          data: {
            updatedBy: { connect: { email: user.email } },
            membershipList: entry.membershipList,
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
