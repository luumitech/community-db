import { z } from 'zod';

export class String {
  public zStr = z.string().trim();

  /** Validate string to be non-empty */
  nonEmpty(msg?: string) {
    return this.zStr.min(1, msg);
  }
}
