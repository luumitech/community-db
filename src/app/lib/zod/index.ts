import { z, type CustomErrorParams } from 'zod';
import { isValidDate } from '~/lib/date-util';
export { z } from 'zod';

/**
 * Coerce string ('true') to boolean:
 *
 * - Only 'true' returns truthy,
 * - All other string will return false
 */
export function zStrToBoolean() {
  return z
    .enum(['true', 'false'])
    .optional()
    .transform((val) => val === 'true');
}

/** Verify that string is non empty */
export function zNonEmptyStr(eParm?: CustomErrorParams) {
  return z.string().trim().min(1, eParm);
}

/**
 * Parse:
 *
 * - Date object (returned by nextUI date component)
 * - Date string
 *
 * Into toISOString format with time components zeroed out
 *
 * @example `2023-02-26T00:00:00.000Z`
 */
export function zAsDate(eParm?: CustomErrorParams) {
  return z.any().transform((val, ctx) => {
    const onError = () => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Not a valid date',
        ...eParm,
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
