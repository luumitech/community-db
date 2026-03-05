import { MongoBackend } from '@agendajs/mongo-backend';
import { Agenda, Job } from 'agenda';
import { GraphQLError } from 'graphql';
import { communityImportTask } from '~/graphql/schema/community/import';
import { batchPropertyModifyTask } from '~/graphql/schema/property/batch-modify';
import { env } from '~/lib/env/server-env';
import { Logger } from '~/lib/logger';
import { JobEntry } from './job-entry';
import { publishJobStatus } from './publish-job-status';

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
        /** Only enable this if job progress tracking in by subscription */
        removeOnComplete: true,
      });

      this._agenda.on('error', (err) => {
        logger.error('Agenda error:', err);
      });

      /** There isn't much value to let UI know that a job has started */
      // this._agenda.on('start', (job) => {
      //   publishJobStatus(job);
      // });
      this._agenda.on('complete', (job) => {
        // This will be called whether the job succeed or fail
        publishJobStatus(job);
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
