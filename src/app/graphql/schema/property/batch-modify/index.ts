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

export const PropertyFilterInput = builder.inputType('PropertyFilterInput', {
  fields: (t) => ({
    searchText: t.string({
      description: 'Match against property address/first name/last name',
    }),
    memberYear: t.int({
      description: 'Only property who is a member of the given year',
    }),
    nonMemberYear: t.int({
      description: 'Only property who is NOT a member of the given year',
    }),
    memberEvent: t.string({
      description: 'Only property who attended this event',
    }),
    withGps: t.boolean({
      description:
        'If true, properties with GPS.  If false, properties without GPS',
    }),
  }),
});

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

  const propertyList = await batchModify.modify();
  /**
   * Would be nice to store this information in agenda queue output, so we can
   * display number of properties modified by the batch command. But I don't
   * think this is currently possible
   */
  return propertyList.length;
}
