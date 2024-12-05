import * as R from 'remeda';
import { z } from 'zod';
import { isValidDate } from '~/lib/date-util';
import { parseAsNumber } from '~/lib/number-util';

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
      .nullable()
      .transform((val) => val === 'true' || val === '1');
  }

  /**
   * Coerce input as number
   *
   * Error condition:
   *
   * - Null (unless you append nullable())
   * - Empty string
   * - NaN
   */
  toNumber(msg?: string) {
    return z.any().transform((val, ctx) => {
      const onError = () => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg ?? 'Not a valid number',
        });
        return z.NEVER;
      };

      const num = parseAsNumber(val);
      if (num == null) {
        return onError();
      }
      return num;
    });
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
   * Error condition:
   *
   * - Null (unless you append nullable())
   *
   * @example `2023-02-26T00:00:00.000Z`
   */
  toIsoDate(msg?: string) {
    return z.any().transform((val, ctx) => {
      const onError = () => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg ?? 'Not a valid date',
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

  /**
   * Coerce:
   *
   * - UI File Input
   *
   * Into:
   *
   * - Browser specific FileList object (if file is successfully uploaded)
   * - Empty array if no file has been uploaded
   */
  toFileList(msg?: string) {
    return z.any().transform((val, ctx) => {
      const onError = () => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: msg ?? 'Please upload a valid file object',
        });
        return z.NEVER;
      };

      if (R.isEmpty(val)) {
        return [];
      }
      if (!(val instanceof FileList)) {
        return onError();
      }
      return val;
    });
  }
}
