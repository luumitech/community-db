import { Job } from 'agenda';
import { publishJobStatus } from '~/lib/job-handler/publish-job-status';
import { StepProgress } from '~/lib/step-progress';

/** Return type of `jobProgress` function */
export type JobProgressOutput<StepDefinition extends Record<string, number>> =
  ReturnType<typeof StepProgress.fromSteps<StepDefinition>>;

/**
 * Hookup agenda Job progress tracker to StepProgress, this enables updating
 * agenda job progress using the stepProgress API
 *
 * @param job Agenda job
 * @param stepDefinition Job progress tracker definition
 * @returns StepProgress object
 */
export function jobProgress<StepDefinition extends Record<string, number>>(
  job: Job,
  stepDefinition: StepDefinition
) {
  return StepProgress.fromSteps(stepDefinition, async (progress) => {
    // Agenda job only takes integer progress value
    await job.touch(Math.ceil(progress));
    publishJobStatus(job);
  });
}
