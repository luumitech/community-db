import { Community, SupportedEvent } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { builder } from '~/graphql/builder';
import { MutationType } from '~/graphql/pubsub';
import { importLcraDB } from '~/lib/lcra-community/import';
import { extractEventList } from '~/lib/lcra-community/import/event-list-util';
import prisma from '~/lib/prisma';
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
      const shortId = self.id.toString();
      const entry = await getCommunityEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
          eventList: true,
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale community ${shortId}, please refresh browser.`
        );
      }

      const { name, eventList, ...optionalInput } = input;

      const community = await prisma.community.update({
        ...query,
        where: {
          id: entry.id,
        },
        data: {
          updatedBy: { connect: { email: user.email } },
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
      pubSub.publish(`community/${shortId}/`, {
        broadcasterId: user.email,
        mutationType: MutationType.UPDATED,
        community,
      });

      return community;
    },
  })
);

const CommunityImportInput = builder.inputType('CommunityImportInput', {
  fields: (t) => ({
    id: t.id({ description: 'community ID', required: true }),
    xlsx: t.field({
      description: 'xlsx containing community information',
      type: 'File',
      required: true,
    }),
  }),
});

builder.mutationField('communityImport', (t) =>
  t.prismaField({
    type: 'Community',
    args: {
      input: t.arg({ type: CommunityImportInput, required: true }),
    },
    resolve: async (query, _parent, args, ctx) => {
      const { user, pubSub } = await ctx;
      const { xlsx } = args.input;
      const bytes = await xlsx.arrayBuffer();
      const xlsxBuf = Buffer.from(bytes);
      const workbook = XLSX.read(xlsxBuf);
      const { propertyList, eventList } = importLcraDB(workbook);

      const shortId = args.input.id.toString();
      const existing = await getCommunityEntry(user, shortId, {
        select: {
          id: true,
          eventList: true,
        },
      });
      const existingEventList = existing.eventList;
      // Only keep existing event list, if imported event list
      // has exact same event (but can be in different order)
      const keepExistingEventList =
        eventList.length === existingEventList.length &&
        R.difference.multiset(existingEventList, eventList).length === 0;

      const community = await prisma.community.update({
        ...query,
        where: { id: existing.id },
        data: {
          ...(!keepExistingEventList && { eventList }),
          propertyList: {
            // Remove existing property list
            deleteMany: {},
            // Add new imported property list
            create: propertyList,
          },
        },
      });

      // broadcast modification to community
      pubSub.publish(`community/${shortId}/`, {
        broadcasterId: user.email,
        mutationType: MutationType.UPDATED,
        community,
      });

      return community;
    },
  })
);
