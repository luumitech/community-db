import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';
import { JobEntry, JobHandler } from '~/lib/job-handler';

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

builder.queryField('jobStatus', (t) =>
  t.field({
    type: jobStatusRef,
    args: {
      id: t.arg.string({ description: 'job ID', required: true }),
    },
    resolve: async (parent, args, ctx, info) => {
      const { id } = args;
      const agenda = await JobHandler.init();
      const job = await agenda.job(id);
      return job;
    },
  })
);
