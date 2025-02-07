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
  static _agenda: Agenda | null = null;

  constructor(private agenda: Agenda) {}

  static async init() {
    if (this._agenda == null) {
      this._agenda = new Agenda({ db: { address: env.MONGODB_URI } });
      this._agenda.define('communityImport', communityImportTask);
      await this._agenda.start();
    }

    return new JobHandler(this._agenda);
  }

  async job(id: string) {
    const jobs = await this.agenda.jobs({ _id: new ObjectId(id) });
    if (jobs.length !== 1) {
      throw new GraphQLError(`Cannot find job ID ${id}`);
    }
    const job = jobs[0];
    return new JobEntry(job);
  }

  async start<T>(jobName: string, data: T) {
    const job = await this.agenda.now<T>(jobName, data);
    return new JobEntry(job);
  }
}
