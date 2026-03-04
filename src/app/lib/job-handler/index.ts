import { MongoBackend } from '@agendajs/mongo-backend';
import { Agenda, Job } from 'agenda';
import { GraphQLError } from 'graphql';
import { communityImportTask } from '~/graphql/schema/community/import';
import { batchPropertyModifyTask } from '~/graphql/schema/property/batch-modify';
import { env } from '~/lib/env/server-env';
import { Logger } from '~/lib/logger';
import { JobEntry } from './job-entry';

export { JobEntry } from './job-entry';

const logger = Logger('lib/job-handler');

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
      this._agenda = new Agenda({
        backend: new MongoBackend({ address: env('MONGODB_URI') }),
        /**
         * Would be cool to use this so we don't leave artifacts in the
         * database, but if this is on, then we can't use polling to determine
         * when a job is finished, because the job document would have already
         * been erased, once the job completes
         */
        // removeOnComplete: true,
      });

      this._agenda.on('error', (err) => {
        logger.error('Agenda error:', err);
      });

      this._agenda.define('communityImport', communityImportTask);
      this._agenda.define('batchPropertyModify', batchPropertyModifyTask);

      await this._agenda.start();
    }

    return new JobHandler(this._agenda);
  }

  async job(id: string) {
    const jobParam = await this.agenda.db.getJobById(id);
    if (!jobParam) {
      throw new GraphQLError(`Cannot find job ID ${id}`);
    }
    const job = new Job(this.agenda, jobParam);
    return new JobEntry(job);
  }

  async start<T>(jobName: string, data: T) {
    const job = await this.agenda.now<T>(jobName, data);
    return new JobEntry(job);
  }
}
