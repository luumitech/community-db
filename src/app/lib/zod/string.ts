import { z } from 'zod';

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
}
