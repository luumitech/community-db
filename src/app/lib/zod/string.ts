import { z } from 'zod';
import { isBuilding, isRunningTest } from '~/lib/env-var';

export class String {
  private zStr(msg?: string) {
    return z.string({ message: msg }).trim();
  }

  /**
   * Validate string to be non-empty
   *
   * - '' is not allowed
   * - Null is not allowed
   */
  nonEmpty(_msg?: string) {
    const msg = _msg ?? 'Must specify a value';

    return this.zStr(msg).min(1, msg);
  }

  /**
   * This should only be used in `env-cfg.ts`, or environment variable schema
   * validation. In addition to checking for nonEmpty string, it also checks
   *
   * - '...' is not allowed
   */
  envVar() {
    const msg = 'Environment variable expects a string';

    return this.nonEmpty(msg).refine((str) => {
      return isBuilding() || isRunningTest()
        ? /**
           * During build or test time, the `.env` file contains placeholder string
           * "...", so this allows schema validation to not flag them. During runtime,
           * they should be replaced with actual value.
           */
          true
        : str !== '...';
    }, msg);
  }
}
