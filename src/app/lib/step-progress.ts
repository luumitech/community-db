import * as R from 'remeda';

/** Progress from 0-100 */
type ProgressCB = (progress: number) => Promise<void>;

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
 * progress.set(50); // overall progress is now 40
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
   * Given a `stepDefinition` of the max percentage for each step, construct the
   * associated `StepProgress` for each step.
   *
   * @example
   *
   * ```ts
   * const progress = StepProgress.fromSteps({ step1: 20, step2: 100 });
   * progress.step1.set(50); // overall progress now 10
   * progress.step1.set(100); // overall progress now 20
   * progress.step2.set(50); // overall progress now 60
   * ```
   *
   * @param stepDefinition Definition containing maximum percentage for each
   *   step
   * @returns StepProgress for each key in given step definition
   */
  static fromSteps<T extends Record<string, number>>(
    stepDefinition: T,
    onProgress: ProgressCB
  ) {
    let min = 0;
    return R.mapValues(stepDefinition, (value) => {
      const max = value as number;
      const step = new StepProgress([min, max], onProgress);
      min = max;
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
