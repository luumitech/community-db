import { Job } from '@hokify/agenda';

export class JobEntry<T = unknown> {
  constructor(private job: Job<T>) {}

  /** Return the ID of the job */
  get id(): string {
    const jobId = this.job.attrs._id;
    if (jobId == null) {
      throw new Error('jobId must be defined');
    }
    return jobId.toHexString();
  }

  /** Current progress of job */
  get progress(): number | null | undefined {
    return this.job.attrs.progress;
  }

  /** Has the job been completed */
  get isComplete(): boolean {
    return this.job.attrs.lastFinishedAt != null;
  }

  /** Has the job failed? */
  get hasFailed(): boolean {
    return this.job.attrs.failedAt != null;
  }

  /** Reason for job failure */
  get failReason(): string | null | undefined {
    return this.job.attrs.failReason;
  }
}
