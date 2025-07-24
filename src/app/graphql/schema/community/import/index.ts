import { Job } from '@hokify/agenda';
import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { verifyAccess } from '~/graphql/schema/access/util';
import { jobPayloadRef } from '~/graphql/schema/job/object';
import { ContextUser } from '~/lib/context-user';
import { JobHandler } from '~/lib/job-handler';
import { CommunityImport } from './community-import';

const ImportMethod = builder.enumType('ImportMethod', {
  values: ['random', 'xlsx', 'map'] as const,
});

const UploadthingInput = builder.inputType('UploadthingInput', {
  fields: (t) => ({
    ufsUrl: t.string({ required: true }),
    key: t.string({ required: true }),
  }),
});

const GeoPointInput = builder.inputType('GeoPointInput', {
  fields: (t) => ({
    lat: t.float({ required: true }),
    lon: t.float({ required: true }),
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
    // Only required when ImportMethod == 'map'
    map: t.field({
      description: 'GPS coordinates of properties to import',
      type: [GeoPointInput],
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
      const { input } = args;
      const { id: shortId } = input;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN]);

      const agenda = await JobHandler.init();

      const job = await agenda.start<CommunityImportJobArg>('communityImport', {
        user,
        input,
      });

      return job;
    },
  })
);

export type CommunityImportInput = typeof CommunityImportInput.$inferInput;
export interface CommunityImportJobArg {
  user: ContextUser;
  input: CommunityImportInput;
}

export async function communityImportTask(job: Job<CommunityImportJobArg>) {
  const communityImport = CommunityImport.fromJob(job);
  await communityImport.start();
}
