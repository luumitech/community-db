import { filter, pipe } from 'graphql-yoga';
import { type JobEntry } from '~/lib/job-handler';
import { builder } from '../../builder';
import { MessageType, type PubSubJobProgressEvent } from '../../pubsub';
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

async function cleanUpAgendaJobs(job: JobEntry) {
  if (!job.hasFailed) {
    /**
     * Clean up the job (remove document from AgendaJobs if completed
     * successfully)
     */
    await job.remove();
  }
}

builder.subscriptionField('jobProgress', (t) =>
  t.field({
    description: 'Subscribe to job progress updates',
    type: jobProgressEventRef,
    nullable: true,
    args: {
      id: t.arg.string({ description: 'job ID', required: true }),
    },
    subscribe: async function* (_parent, args, ctx) {
      const { user, jobHandler, pubSub } = ctx;

      const jobId = args.id;
      const job = await jobHandler.job(jobId);
      // Terminate subscription if the job has already ended
      if (job.isComplete || job.hasFailed) {
        yield {
          broadcasterId: user.email,
          messageType: MessageType.UPDATED,
          job,
        } satisfies PubSubJobProgressEvent;
        await cleanUpAgendaJobs(job);
        return;
      }

      const subscription = pipe(
        pubSub.subscribe(`jobProgress/${args.id}/`),
        filter((event) => {
          // Only subscribe to events that context user publish themselves
          return event.broadcasterId === user.email;
        })
      );

      for await (const event of subscription) {
        yield event;

        // Terminate subscription once the job has eneded
        if (event.job.isComplete || event.job.hasFailed) {
          await cleanUpAgendaJobs(event.job);
          return;
        }
      }
    },
    resolve: (event) => event,
  })
);
