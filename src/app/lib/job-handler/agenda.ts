import { MongoBackend } from '@agendajs/mongo-backend';
import { Agenda } from 'agenda';
import {
  communityImportTask,
  type CommunityImportJobArg,
} from '~/graphql/schema/community/import';
import {
  batchPropertyModifyTask,
  type BatchPropertyModifyJobArg,
} from '~/graphql/schema/property/batch-modify';
import { isProduction } from '~/lib/env';
import { appGlobal } from '~/lib/global';
import { Logger } from '~/lib/logger';
import { mongoClient } from '~/lib/mongo-client';
import { publishJobStatus } from './publish-job-status';

const logger = Logger('lib/job-handler/agenda');

export interface AgendaJobMap {
  communityImport: CommunityImportJobArg;
  batchPropertyModify: BatchPropertyModifyJobArg;
}

/** Create an Agenda singleton for use within the application */
export async function getAgenda() {
  if (appGlobal.agenda) {
    if (isProduction()) {
      return appGlobal.agenda;
    }

    /**
     * For unknown reason, Agenda is not working correctly after hot reload
     *
     * - This is a workaround to stop existing Agenda instance, so we can create a
     *   fresh one in development environment
     */
    await appGlobal.agenda.stop();
    appGlobal.agenda.removeAllListeners();
    appGlobal.agenda = undefined;
  }

  const agenda = new Agenda({
    backend: new MongoBackend({
      // Reuse the single global instance of the mongo database
      mongo: mongoClient.db(),
    }),
    /**
     * It would be nice to removeOnComplete by default, but we need to handle
     * the case when the subscription for job progress happens after the job has
     * already been completed. So we leave this false, so we can manage the job
     * document manually
     */
    removeOnComplete: false,
  });

  agenda.on('error', (err) => {
    logger.error('Agenda error:', err);
  });

  /** There isn't much value to let UI know that a job has started */
  // agenda.on('start', (job) => {
  //   publishJobStatus(job);
  // });
  agenda.on('complete', async (job) => {
    // This will be called whether the job succeed or fail
    publishJobStatus(job);
  });

  agenda.define('communityImport', communityImportTask);
  agenda.define('batchPropertyModify', batchPropertyModifyTask);

  await agenda.start();
  appGlobal.agenda = agenda;
  return agenda;
}
