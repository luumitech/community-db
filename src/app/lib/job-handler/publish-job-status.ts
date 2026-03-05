import { Job } from 'agenda';
import { MessageType, pubSub } from '~/graphql/pubsub';
import { ContextUser } from '~/lib/context-user';
import { JobEntry } from '~/lib/job-handler';

interface DefaultJobArg {
  user: ContextUser;
}

/**
 * Publish latest job status (mainly for apollo subscription)
 *
 * @param job Agenda job
 * @returns
 */
export function publishJobStatus(job: Job<unknown>) {
  // We assume all jobs created follows the DefaultJobArg template
  const jobEntry = new JobEntry(job as Job<DefaultJobArg>);

  // Publish updated job status
  const { user } = jobEntry.data;
  pubSub.publish(`jobProgress/${jobEntry.id}/`, {
    broadcasterId: user.email,
    messageType: MessageType.UPDATED,
    job: jobEntry,
  });
}
