import { Role } from '@prisma/client';
import { Job } from 'agenda';
import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { verifyAccess } from '~/graphql/schema/access/util';
import { UpdateInput } from '~/graphql/schema/common';
import { jobPayloadRef } from '~/graphql/schema/job/object';
import { PropertyFilterInput } from '~/graphql/schema/property/property-filter';
import { type ContextUser } from '~/lib/context-user';
import { EventInput } from '../modify';
import { BatchModify } from './batch-modify';

const BatchMembershipInput = builder.inputType('BatchMembershipInput', {
  fields: (t) => ({
    year: t.int({ required: true }),
    isMember: t.boolean(),
    price: t.string(),
    paymentDate: t.string(),
    paymentMethod: t.string(),
    eventAttended: t.field({ type: EventInput, required: true }),
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
    method: t.field({ type: batchModifyMethodRef, required: true }),
    filter: t.field({ type: PropertyFilterInput }),
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
      const { user, jobHandler } = ctx;
      const { input } = args;
      const shortId = input.self.id;

      // Make sure user has permission to modify
      await verifyAccess(user, { shortId }, [Role.ADMIN, Role.EDITOR]);

      const job = await jobHandler.start('batchPropertyModify', {
        user,
        input,
      });
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
