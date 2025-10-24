import { Job } from '@hokify/agenda';
import { Role } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { verifyAccess } from '~/graphql/schema/access/util';
import { UpdateInput } from '~/graphql/schema/common';
import { jobPayloadRef } from '~/graphql/schema/job/object';
import { type ContextUser } from '~/lib/context-user';
import { JobHandler } from '~/lib/job-handler';
import { EventInput } from '../modify';
import { BatchModify } from './batch-modify';

const BatchMembershipInput = builder.inputType('BatchMembershipInput', {
  fields: (t) => ({
    year: t.int({ required: true }),
    eventAttended: t.field({ type: EventInput, required: true }),
    paymentMethod: t.string({ required: true }),
    price: t.string(),
  }),
});

const batchModifyMethodRef = builder.enumType('BatchModifyMethod', {
  values: ['ADD_EVENT', 'ADD_GPS'] as const,
});

const BatchGpsInput = builder.inputType('BatchGpsInput', {
  fields: (t) => ({
    city: t.string(),
    province: t.string(),
    country: t.string(),
  }),
});

const BatchPropertyModifyInput = builder.inputType('BatchPropertyModifyInput', {
  fields: (t) => ({
    self: t.field({ type: UpdateInput, required: true }),
    query: t.field({
      type: 'JSONObject',
      description: 'prisma query on Property document',
    }),
    method: t.field({ type: batchModifyMethodRef, required: true }),
    membership: t.field({ type: BatchMembershipInput }),
    gps: t.field({ type: BatchGpsInput }),
  }),
});

builder.mutationField('batchPropertyModify', (t) =>
  t.field({
    type: jobPayloadRef,
    args: {
      input: t.arg({ type: BatchPropertyModifyInput, required: true }),
    },
    resolve: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
      const { input } = args;
      const shortId = input.self.id;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      const agenda = await JobHandler.init();

      const job = await agenda.start<BatchPropertyModifyJobArg>(
        'batchPropertyModify',
        { user, input }
      );

      return job;
    },
  })
);

export type BatchPropertyModifyInput =
  typeof BatchPropertyModifyInput.$inferInput;
export interface BatchPropertyModifyJobArg {
  user: ContextUser;
  input: BatchPropertyModifyInput;
}

export async function batchPropertyModifyTask(
  job: Job<BatchPropertyModifyJobArg>
) {
  const batchModify = BatchModify.fromJob(job);
  await batchModify.start();
}
