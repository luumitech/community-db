import { filter, pipe } from 'graphql-yoga';
import { type JobEntry } from '~/lib/job-handler';
import { builder } from '../../builder';
import { type PubSubJobProgressEvent } from '../../pubsub';
import { subscriptionEventRef } from '../subscription';

const jobStatusRef = builder.objectRef<JobEntry>('JobStatus').implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    progress: t.exposeInt('progress', {
      nullable: true,
      description: 'progress from 0 to 100',
    }),
    failReason: t.exposeString('failReason', { nullable: true }),
    isComplete: t.exposeBoolean('isComplete'),
    hasFailed: t.exposeBoolean('hasFailed'),
  }),
});

const jobProgressEventRef = builder
  .objectRef<PubSubJobProgressEvent>('SubscriptionJobProgressEvent')
  .implement({
    interfaces: [subscriptionEventRef],
    fields: (t) => ({
      job: t.field({
        type: jobStatusRef,
        nullable: true,
        resolve: (event, args, ctx) => {
          const { job } = event;
          return job;
        },
      }),
    }),
  });

builder.subscriptionField('jobProgress', (t) =>
  t.field({
    description: 'Subscribe to job progress updates',
    type: jobProgressEventRef,
    nullable: true,
    args: {
      id: t.arg.string({ description: 'job ID', required: true }),
    },
    subscribe: async (_parent, args, ctx) => {
      const { user, pubSub } = ctx;
      return pipe(
        pubSub.subscribe(`jobProgress/${args.id}/`),
        filter((event) => {
          // Only subscribe to events that context user publish themselves
          return event.broadcasterId === user.email;
        })
      );
    },
    resolve: (event) => event,
  })
);
