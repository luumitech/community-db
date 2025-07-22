import { Job } from '@hokify/agenda';
import { StepProgress } from '~/lib/step-progress';

/** Return type of `jobProgress` function */
export type JobProgressOutput<StepDefinition extends Record<string, number>> =
  ReturnType<typeof jobProgress<unknown, StepDefinition>>;

/**
 * Hookup agenda Job progress tracker to StepProgress, this enables updating
 * agenda job progress using the stepProgress API
 *
 * @param job Agenda job
 * @param stepDefinition Job progress tracker definition
 * @returns StepProgress object
 */
export function jobProgress<
  JobArg,
  StepDefinition extends Record<string, number>,
>(job: Job<JobArg>, stepDefinition: StepDefinition) {
  return StepProgress.fromSteps(stepDefinition, async (progress) => {
    // Agenda job only takes integer progress value
    await job.touch(Math.ceil(progress));
  });
}
