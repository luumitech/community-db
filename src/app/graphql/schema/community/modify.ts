import { Community, Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as XLSX from 'xlsx';
import { builder } from '~/graphql/builder';
import { MutationType } from '~/graphql/pubsub';
import { importLcraDB } from '~/lib/lcra-community/import';
import { seedCommunityData } from '~/lib/lcra-community/random-seed';
import prisma from '~/lib/prisma';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { verifyAccess } from '../access/util';
import { UpdateInput } from '../common';
import { getSubscriptionEntry } from '../payment/util';
import { NameListUtil } from './name-list-util';
import { getCommunityEntry } from './util';

const DefaultSettingInput = builder.inputType('DefaultSettingInput', {
  fields: (t) => ({
    membershipFee: t.string(),
  }),
});

const EventItemInput = builder.inputType('EventItemInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});
const TicketItemInput = builder.inputType('TicketItemInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
    count: t.int(),
    unitPrice: t.string(),
  }),
});
const PaymentMethodInput = builder.inputType('PaymentMethodInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});

const CommunityModifyInput = builder.inputType('CommunityModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    name: t.string(),
    eventList: t.field({ type: [EventItemInput] }),
    ticketList: t.field({ type: [TicketItemInput] }),
    paymentMethodList: t.field({ type: [PaymentMethodInput] }),
    defaultSetting: t.field({ type: DefaultSettingInput }),
  }),
});

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
          ticketList: true,
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

      const {
        name,
        eventList,
        ticketList,
        paymentMethodList,
        ...optionalInput
      } = input;

      const nameListUtil = await NameListUtil.fromDB(entry.id);

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
            eventList: nameListUtil.getCompleteEventList(eventList),
          }),
          ...(!!ticketList && {
            ticketList: nameListUtil.getCompleteTicketList(ticketList),
          }),
          // If paymentMethodList is provided, make sure paymentMethodList contains
          // every payment method used within the community database
          ...(!!paymentMethodList && {
            paymentMethodList:
              nameListUtil.getCompletePaymentMethodList(paymentMethodList),
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
      await verifyAccess(user, { shortId }, [Role.ADMIN]);

      let workbook;
      switch (method) {
        case 'random':
          {
            const seedJson = seedCommunityData(10);
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
        select: { id: true, owner: true },
      });

      // Check community owner's subscription status to determine
      // limitation
      const existingSub = await getSubscriptionEntry(existing.owner);
      const { propertyLimit } = existingSub;
      if (propertyLimit != null) {
        if (propertyList.length > propertyLimit) {
          throw new GraphQLError(
            `This community can at most have ${propertyLimit} properties.`
          );
        }
      }

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
