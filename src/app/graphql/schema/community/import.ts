import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as XLSX from 'xlsx';
import { builder } from '~/graphql/builder';
import { MessageType } from '~/graphql/pubsub';
import { importLcraDB } from '~/lib/lcra-community/import';
import { seedCommunityData } from '~/lib/lcra-community/random-seed';
import prisma from '~/lib/prisma';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { verifyAccess } from '../access/util';
import { getSubscriptionEntry } from '../payment/util';
import { getCommunityEntry } from './util';

const ImportMethod = builder.enumType('ImportMethod', {
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
        messageType: MessageType.CREATED,
        community,
      });

      return community;
    },
  })
);
