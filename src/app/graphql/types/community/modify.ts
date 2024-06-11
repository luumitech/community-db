import { Community, SupportedEvent } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { extractEventList } from '../../../lib/lcra-community/import/event-list-util';
import prisma from '../../../lib/prisma';
import { builder } from '../../builder';
import { MutationType } from '../../pubsub';
import { UpdateInput } from '../common';
import { getCommunityEntry } from './util';

const SupportedEventInput = builder.inputType('SupportedEventInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});

const CommunityModifyInput = builder.inputType('CommunityModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    name: t.string(),
    eventList: t.field({ type: [SupportedEventInput] }),
  }),
});

/**
 * Generate eventList entry for database
 *
 * User may want a reduced list of events to show when selecting
 * in the UI, but the database may contain events that are still being
 * referenced, and they need to be maintained in this list.
 * We'll mark these entries as hidden, so they would still show up
 * properly in the selection UI
 *
 * @param community community entry in database
 * @param eventList new event list as requested by user
 * @returns
 */
async function getCompleteEventList(
  community: Pick<Community, 'id' | 'eventList'>,
  eventList: (typeof SupportedEventInput.$inferInput)[]
) {
  const result: SupportedEvent[] = [];
  eventList.forEach(({ name }) => {
    result.push({ name, hidden: false });
  });

  // mark any events missing in the input eventList as hidden
  const propertyList = await prisma.property.findMany({
    where: { communityId: community.id },
    select: { membershipList: true },
  });
  const completeEventList = extractEventList(propertyList);
  completeEventList.forEach((name) => {
    if (!eventList.find((entry) => entry.name === name)) {
      result.push({ name, hidden: true });
    }
  });

  return result;
}

builder.mutationField('communityModify', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      input: t.arg({ type: CommunityModifyInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user, pubSub } = await ctx;
      const { self, ...input } = args.input;
      const entry = await getCommunityEntry(user, self.id.toString(), {
        ...query,
        select: {
          id: true,
          updatedAt: true,
          eventList: true,
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale community ${self.id.toString()}, please refresh browser.`
        );
      }

      const { name, eventList, ...optionalInput } = input;

      const community = await prisma.community.update({
        ...query,
        where: {
          id: self.id.toString(),
        },
        data: {
          updatedBy: user.email,
          // non-nullable fields needs to be specified explicitly
          ...(!!name && { name }),
          // If eventList is provided, make sure eventList contains
          // every event used within the community database
          ...(!!eventList && {
            eventList: await getCompleteEventList(entry, eventList),
          }),
          ...optionalInput,
        },
      });

      // broadcast modification to community
      pubSub.publish(`community/${community.id}/`, {
        mutationType: MutationType.UPDATED,
        community,
      });

      return community;
    },
  })
);
