import { Agenda, Job } from 'agenda';
import { GraphQLError } from 'graphql';
import { getAgenda, type AgendaJobMap } from './agenda';
import { JobEntry } from './job-entry';

export { JobEntry } from './job-entry';

/**
 * Helper class for queuing long running job
 *
 * This is backed by Agenda
 */
export class JobHandler {
  constructor(private agenda: Agenda) {}

  /**
   * Initialize Agenda task scheduler
   *
   * @returns A JobHandler instance
   */
  static async init() {
    const agenda = await getAgenda();
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
