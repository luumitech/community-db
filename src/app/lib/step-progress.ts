import * as R from 'remeda';

type ProgressCB =
  /**
   * Valid Progress input:
   *
   * Any float: from 0-100
   */
  (progress: number) => Promise<void>;

/**
 * Implement progress tracking for each step
 *
 * Given progress range, this API will interpolate progress percentage (0-100)
 * to the given range.
 *
 * @example
 *
 * ```ts
 * const progress = new StepProgress([0, 80], cb);
 * progress.set(0); // overall progress is now 0
 * progress.set(50); // overall progress is now 40 (50% of 80)
 * progress.set(100); // overall progress is now 80
 * ```
 */
export class StepProgress {
  constructor(
    /** Start and end range, both number is from 0-100 */
    private range: [number, number],
    /**
     * Callback to report on the current calculated progress each time
     * `updateProgress` is called
     */
    private onProgress: ProgressCB
  ) {}

  /**
   * A `stepDefinition` consists of the starting percentage for each step.
   *
   * This method takes the `stepDefinition` and create StepProgress object for
   * each step, to allow you to update the progress percentage for each step
   * individually. When the last step completes, the overall percentage will be
   * set to 100.
   *
   * @example
   *
   * ```ts
   * const progress = StepProgress.fromSteps({ step1: 10, step2: 80 });
   * progress.step1.set(0); // overall progress now 10
   * progress.step1.set(50); // overall progress now 45 (half way between step1 and step2)
   * progress.step1.set(100); // overall progress now 80
   * progress.step2.set(50); // overall progress now 90 (half way between step2 and 100%)
   * ```
   *
   * @param stepDefinition Definition containing minimum percentage for each
   *   step,
   * @returns StepProgress for each key in given step definition
   */
  static fromSteps<T extends Record<string, number>>(
    stepDefinition: T,
    onProgress: ProgressCB
  ) {
    // Initialize progress to 0
    onProgress(0);

    let stepIdx = 0;
    const minValues = Object.values(stepDefinition);
    return R.mapValues(stepDefinition, (value) => {
      const nextStepIdx = stepIdx + 1;
      const min = value as number;
      const max = minValues[nextStepIdx] ?? 100;
      const step = new StepProgress([min, max], onProgress);
      stepIdx++;
      return step;
    });
  }

  /**
   * Update progress, this API will automatically calculate the correct
   * percentage given the min/max percentage bound
   *
   * @param progress Progress percentage for the step (0-100)
   */
  async set(progress: number) {
    const min = this.range[0];
    const max = this.range[1];
    const total = max - min;
    const overAllProgress = min + total * (progress / 100);
    await this.onProgress(overAllProgress);
  }
}
