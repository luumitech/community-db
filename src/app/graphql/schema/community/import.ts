import { Job } from '@hokify/agenda';
import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import * as R from 'remeda';
import * as XLSX from 'xlsx';
import { builder } from '~/graphql/builder';
import { type ContextUser } from '~/lib/context-user';
import { JobHandler } from '~/lib/job-handler';
import prisma from '~/lib/prisma';
import { utapi } from '~/lib/uploadthing';
import { WorksheetHelper } from '~/lib/worksheet-helper';
import { importXlsx, type CommunityEntry } from '~/lib/xlsx-io/import';
import { seedCommunityData } from '~/lib/xlsx-io/random-seed';
import { verifyAccess } from '../access/util';
import { jobPayloadRef } from '../job/object';
import { getSubscriptionEntry } from '../payment/util';
import { getCommunityEntry } from './util';

const ImportMethod = builder.enumType('ImportMethod', {
  values: ['random', 'xlsx'] as const,
});

const UploadthingInput = builder.inputType('UploadthingInput', {
  fields: (t) => ({
    ufsUrl: t.string({ required: true }),
    key: t.string({ required: true }),
  }),
});

const CommunityImportInput = builder.inputType('CommunityImportInput', {
  fields: (t) => ({
    id: t.string({ description: 'community ID', required: true }),
    method: t.field({
      description: 'Import Method',
      type: ImportMethod,
      required: true,
    }),
    // Only required when ImportMethod == 'xlsx'
    xlsx: t.field({
      description: 'uploadthing file resource object',
      type: UploadthingInput,
    }),
  }),
});

builder.mutationField('communityImport', (t) =>
  t.field({
    type: jobPayloadRef,
    args: {
      input: t.arg({ type: CommunityImportInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
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

            const res = await fetch(xlsx.ufsUrl, { method: 'GET' });
            const bytes = await res.arrayBuffer();
            const xlsxBuf = Buffer.from(bytes);
            workbook = XLSX.read(xlsxBuf);

            // Remove xlsx from uploadthing, after processing its content
            await utapi.deleteFiles(xlsx.key);
          }
          break;

        default:
          throw new GraphQLError(`Unrecognized import method ${method}`);
      }
      const community = importXlsx(workbook);
      const agenda = await JobHandler.init();

      const job = await agenda.start<ImportJobArg>('communityImport', {
        user,
        shortId,
        community,
      });

      return job;
    },
  })
);

interface ImportJobArg {
  user: ContextUser;
  /** Community short ID */
  shortId: string;
  community: CommunityEntry;
}

export async function communityImportTask(job: Job<ImportJobArg>) {
  const { user, shortId, community: communityEntry } = job.attrs.data;
  const {
    propertyList: { create: propertyList },
    ...others
  } = communityEntry;

  await job.touch(10);

  const community = await getCommunityEntry(user, shortId, {
    select: { id: true, owner: true },
  });

  // Check community owner's subscription status to determine
  // limitation
  const existingSub = await getSubscriptionEntry(community.owner);
  const { propertyLimit } = existingSub;
  if (propertyLimit != null) {
    if (propertyList.length > propertyLimit) {
      throw new GraphQLError(
        `This community can at most have ${propertyLimit} properties.`
      );
    }
  }

  await job.touch(20);

  /**
   * It's possible to do the update in an interactive transaction
   *
   * See:
   * https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
   *
   * But by default, interactive transaction timeouts after 5s, but we don't
   * know how long an import action may take. So we decided not to do
   * transaction here.
   */

  await prisma.community.update({
    where: { id: community.id },
    data: {
      ...others,
      propertyList: {
        // Remove existing property list
        deleteMany: {},
        // Add new imported property list
        // For unknown reason, when adding lots of properties within a single transaction,
        // the transaction operation fails in production instance.  (works fine locally)
        // create: propertyList,
      },
    },
  });

  // Inserting in bulk by chunks would allow progress report
  const propertyChunk = R.chunk(propertyList, 100);
  for (const [idx, chunk] of propertyChunk.entries()) {
    await prisma.community.update({
      where: { id: community.id },
      data: {
        propertyList: {
          create: chunk,
        },
      },
    });
    await job.touch(20 + Math.ceil((idx / propertyChunk.length) * 80));
  }
}
