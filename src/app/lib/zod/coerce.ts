import * as R from 'remeda';
import { z, type ZodAny, type ZodEffects } from 'zod';
import { isValidDate } from '~/lib/date-util';
import { parseAsNumber } from '~/lib/number-util';
import { type ValidateFn } from './validate';

interface CoerceOpt {
  message?: string;
}

interface ToBooleanOpt extends CoerceOpt {}
interface ToIsoDateOpt extends CoerceOpt {}
interface ToNumberOpt extends CoerceOpt {
  nullable?: boolean;
  /**
   * Validation function
   *
   * - If validation fails, return an error message
   * - Otherwise return null
   */
  validateFn?: ValidateFn<number> | ValidateFn<number>[];
}
interface ToFileArrayOpt extends CoerceOpt {}
interface ToCurrencyOpt extends CoerceOpt {}

/**
 * Loop through validation functions and determine if input `val` has passed
 * validation
 */
function validate<T>(valFn: ValidateFn<T> | ValidateFn<T>[], val: T) {
  const fnList = Array.isArray(valFn) ? valFn : [valFn];

  // Loop through validation function and return first failed validation
  let message: string | null = null;
  for (const fn of fnList) {
    message = fn(val);
    if (message != null) {
      break;
    }
  }
  return message;
}

export class Coerce {
  /**
   * Coerce string `true` or `1` to boolean:
   *
   * - Only `true` or `1` returns true,
   * - All other string will return false
   */
  toBoolean(opt?: ToBooleanOpt) {
    return z
      .string()
      .trim()
      .optional()
      .nullable()
      .transform((val) => val === 'true' || val === '1');
  }

  /**
   * Coerce input as number. This is useful for used in a selection component,
   * when you do not want empty selection (i.e. '') to be converted to 0.
   *
   * In contrast, `z.coerce.number()` transforms '' to 0.
   *
   * Normally, all non number input will be flagged as error:
   *
   * - Null/undefined
   * - Empty string (useful for reject empty selection)
   * - NaN
   *
   * If you don't want to flag non number as error, set `opt.nullable` to true
   */
  toNumber<T extends ToNumberOpt>(
    opt?: T
  ): ZodEffects<ZodAny, T['nullable'] extends true ? number | null : number> {
    return z.any().transform((val, ctx) => {
      const onError = (message: string) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        });
        return z.NEVER;
      };

      const num = parseAsNumber(val);
      if (num == null) {
        if (!opt?.nullable) {
          return onError(opt?.message ?? 'Not a valid number');
        }
      } else if (opt?.validateFn) {
        const message = validate(opt.validateFn, num);
        if (message) {
          return onError(message);
        }
      }

      return num as unknown as number;
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
   * - Null
   *
   * @example `2023-02-26T00:00:00.000Z`
   */
  toIsoDate(opt?: ToIsoDateOpt) {
    return z.any().transform((val, ctx) => {
      const onError = () => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: opt?.message ?? 'Not a valid date',
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
   * Into File[]:
   *
   * - Array of browser specific File object (if file is successfully uploaded)
   * - Empty array if no file has been uploaded
   */
  toFileArray(opt?: ToFileArrayOpt) {
    return z.any().transform<File[]>((val, ctx) => {
      const onError = () => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: opt?.message ?? 'Please upload a valid file object',
        });
        return z.NEVER;
      };

      if (R.isEmpty(val)) {
        return [];
      }
      /**
       * Input element encodes File object as FileList
       *
       * See: https://developer.mozilla.org/en-US/docs/Web/API/FileList
       */
      if (!(val instanceof FileList)) {
        return onError();
      }

      return Array.from(val);
    });
  }

  /**
   * Coerce input as currencyInput(string). This is useful for CurrencyInput
   * when you want empty value (i.e. '') to be converted to null
   *
   * Normally, `z.string().nullable()` will accept '' as valid input
   */
  toCurrency(opt?: ToCurrencyOpt): ZodEffects<ZodAny, string | null> {
    return z.any().transform((val, ctx) => {
      const onError = (message: string) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
        });
        return z.NEVER;
      };

      if (val == null) {
        return null;
      }

      const trimmedStr = val.trim();
      if (!trimmedStr) {
        // Coerce empty string into null
        return null;
      }

      // TODO: perform further checking to see if it is valid currency format

      return trimmedStr as unknown as string;
    });
  }
}
