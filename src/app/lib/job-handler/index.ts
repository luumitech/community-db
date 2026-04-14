import { MongoBackend } from '@agendajs/mongo-backend';
import { Agenda, Job } from 'agenda';
import { GraphQLError } from 'graphql';
import {
  communityImportTask,
  type CommunityImportJobArg,
} from '~/graphql/schema/community/import';
import {
  batchPropertyModifyTask,
  type BatchPropertyModifyJobArg,
} from '~/graphql/schema/property/batch-modify';
import { Logger } from '~/lib/logger';
import mongoClient from '~/lib/mongo-client';
import { JobEntry } from './job-entry';
import { publishJobStatus } from './publish-job-status';

export { JobEntry } from './job-entry';

const logger = Logger('lib/job-handler');

interface AgendaJobMap {
  communityImport: CommunityImportJobArg;
  batchPropertyModify: BatchPropertyModifyJobArg;
}

/**
 * Helper class for queuing long running job
 *
 * This is backed by Agenda
 */
export class JobHandler {
  constructor(private agenda: Agenda) {}

  /**
   * Initialize Agenda task scheduler using the underlying database
   *
   * @returns A JobHandler instance
   */
  static async init() {
    const agenda = new Agenda({
      backend: new MongoBackend({
        // Reuse the single global instance of the mongo database
        mongo: mongoClient.db(),
      }),
      /**
       * It would be nice to removeOnComplete by default, but we need to handle
       * the case when the subscription for job progress happens after the job
       * has already been completed. So we leave this false, so we can manage
       * the job document manually
       */
      removeOnComplete: false,
    });

    agenda.on('error', (err) => {
      logger.error('Agenda error:', err);
    });

    /** There isn't much value to let UI know that a job has started */
    // this._agenda.on('start', (job) => {
    //   publishJobStatus(job);
    // });
    agenda.on('complete', async (job) => {
      // This will be called whether the job succeed or fail
      publishJobStatus(job);
    });

    agenda.define('communityImport', communityImportTask);
    agenda.define('batchPropertyModify', batchPropertyModifyTask);

    await agenda.start();
    return new JobHandler(agenda);
  }

  /**
   * Get the job entry associated with the job Id
   *
   * @param id JobID
   * @returns
   */
  async job(id: string) {
    const jobParam = await this.agenda.db.getJobById(id);
    if (!jobParam) {
      throw new GraphQLError(`Cannot find job ID ${id}`);
    }
    const job = new Job(this.agenda, jobParam);
    return new JobEntry(job);
  }

  /**
   * Start a task right away
   *
   * @param jobName Job name
   * @param data Arguments to be passed to the job
   * @returns
   */
  async start<TName extends keyof AgendaJobMap>(
    jobName: TName,
    data: AgendaJobMap[TName]
  ) {
    const job = await this.agenda.now<AgendaJobMap[TName]>(jobName, data);
    return new JobEntry(job);
  }
}
