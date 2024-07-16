import { Community, Role, SupportedSelectItem } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as XLSX from 'xlsx';
import { builder } from '~/graphql/builder';
import { MutationType } from '~/graphql/pubsub';
import { importLcraDB } from '~/lib/lcra-community/import';
import { extractEventList } from '~/lib/lcra-community/import/event-list-util';
import { extractPaymentMethodList } from '~/lib/lcra-community/import/payment-method-list-util';
import { seedCommunityData } from '~/lib/lcra-community/random-seed';
import prisma from '~/lib/prisma';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { getCommunityEntry } from './util';

const NameInput = builder.inputType('NameInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});

const CommunityModifyInput = builder.inputType('CommunityModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    name: t.string(),
    eventList: t.field({ type: [NameInput] }),
    paymentMethodList: t.field({ type: [NameInput] }),
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
  eventList: (typeof NameInput.$inferInput)[]
) {
  const result: SupportedSelectItem[] = [];
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

/**
 * Generate paymentMethodList entry for database
 *
 * User may want a reduced list of payment methods to show when selecting
 * in the UI, but the database may contain methods that are still being
 * referenced, and they need to be maintained in this list.
 * We'll mark these entries as hidden, so they would still show up
 * properly in the selection UI
 *
 * @param community community entry in database
 * @param paymentMethodList new event list as requested by user
 * @returns
 */
async function getCompletePaymentMethodList(
  community: Pick<Community, 'id' | 'paymentMethodList'>,
  paymentMethodList: (typeof NameInput.$inferInput)[]
) {
  const result: SupportedSelectItem[] = [];
  paymentMethodList.forEach(({ name }) => {
    result.push({ name, hidden: false });
  });

  // mark any events missing in the input eventList as hidden
  const propertyList = await prisma.property.findMany({
    where: { communityId: community.id },
    select: { membershipList: true },
  });
  const completePaymentMethodList = extractPaymentMethodList(propertyList);
  completePaymentMethodList.forEach((name) => {
    if (!paymentMethodList.find((entry) => entry.name === name)) {
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
      const shortId = self.id;
      const entry = await getCommunityEntry(user, shortId, {
        select: {
          id: true,
          updatedAt: true,
          eventList: true,
          paymentMethodList: true,
        },
      });
      if (entry.updatedAt.toISOString() !== self.updatedAt) {
        throw new GraphQLError(
          `Attempting to update a stale community ${shortId}, please refresh browser.`
        );
      }

      // Make sure user has permission to modify
      await verifyAccess(user, { id: entry.id }, [Role.ADMIN, Role.EDITOR]);

      const { name, eventList, paymentMethodList, ...optionalInput } = input;

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
          // If paymentMethodList is provided, make sure paymentMethodList contains
          // every payment method used within the community database
          ...(!!paymentMethodList && {
            paymentMethodList: await getCompletePaymentMethodList(
              entry,
              paymentMethodList
            ),
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

export const ImportMethod = builder.enumType('ImportMethod', {
  values: ['random', 'xlsx'] as const,
});

const CommunityImportInput = builder.inputType('CommunityImportInput', {
  fields: (t) => ({
    id: t.string({ description: 'community ID', required: true }),
    method: t.field({
      description: 'Import Method',
      type: ImportMethod,
      required: true,
    }),
    xlsx: t.field({
      description: 'xlsx containing community information',
      type: 'File',
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
      const { id: shortId, method, xlsx } = args.input;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      let workbook;
      switch (method) {
        case 'random':
          {
            const seedJson = seedCommunityData(20);
            const wsHelper = WorksheetHelper.fromJson(seedJson, 'Membership');
            workbook = wsHelper.wb;
          }
          break;

        case 'xlsx':
          {
            if (!xlsx) {
              throw new GraphQLError(
                'When Import Method is Excel, you must upload a valid xlsx file.'
              );
            }
            const bytes = await xlsx.arrayBuffer();
            const xlsxBuf = Buffer.from(bytes);
            workbook = XLSX.read(xlsxBuf);
          }
          break;

        default:
          throw new GraphQLError(`Unrecognized import method ${method}`);
      }
      const { propertyList, ...others } = importLcraDB(workbook);

      const existing = await getCommunityEntry(user, shortId, {
        select: {
          id: true,
        },
      });

      const community = await prisma.community.update({
        ...query,
        where: { id: existing.id },
        data: {
          ...others,
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
