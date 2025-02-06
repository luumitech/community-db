import { Agenda } from '@hokify/agenda';
import { GraphQLError } from 'graphql';
import { ObjectId } from 'mongodb';
import { communityImportTask } from '~/graphql/schema/community/import';
import { env } from '~/lib/env-cfg';
import { JobEntry } from './job-entry';

export { JobEntry } from './job-entry';

/**
 * Helper class for queuing long running job
 *
 * This is backed by Agenda
 */
export class JobHandler {
  static agenda = new Agenda({ db: { address: env.MONGODB_URI } });

  static async init() {
    this.agenda.define('communityImport', communityImportTask);
    await this.agenda.start();
    return new JobHandler();
  }

  async job(id: string) {
    const jobs = await JobHandler.agenda.jobs({ _id: new ObjectId(id) });
    if (jobs.length !== 1) {
      throw new GraphQLError(`Cannot find job ID ${id}`);
    }
    const job = jobs[0];
    return new JobEntry(job);
  }

  async start<T>(jobName: string, data: T) {
    const job = await JobHandler.agenda.now<T>(jobName, data);
    return new JobEntry(job);
  }
}
