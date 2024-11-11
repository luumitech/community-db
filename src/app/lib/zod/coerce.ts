import { z, type IssueData } from 'zod';
import { isValidDate } from '~/lib/date-util';

export class Coerce {
  /**
   * Coerce string `true` or `1` to boolean:
   *
   * - Only `true` or `1` returns true,
   * - All other string will return false
   */
  toBoolean() {
    return z
      .string()
      .trim()
      .optional()
      .transform((val) => val === 'true' || val === '1');
  }

  /**
   * Coerce:
   *
   * - Date object (returned by nextUI date component)
   * - Date string (i.e. `2023-02-26T12:12:30.000Z`)
   *
   * Into:
   *
   * - ISOString format with time components zeroed out
   *
   * @example `2023-02-26T00:00:00.000Z`
   */
  toIsoDate(issueData?: IssueData) {
    return z.any().transform((val, ctx) => {
      const onError = () => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Not a valid date',
          ...issueData,
        });
        return z.NEVER;
      };

      if (val == null) {
        return onError();
      }
      const date = new Date(val);
      if (!isValidDate(date)) {
        return onError();
      }
      // Remove timestamp portion of date
      date.setUTCHours(0, 0, 0, 0);
      return date.toISOString();
    });
  }
}
