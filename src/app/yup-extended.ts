'use client';
import * as yup from 'yup';
import { isValidDate } from '~/lib/date-util';

declare module 'yup' {
  interface StringSchema<TType> extends yup.Schema<TType> {
    /**
     * Interpret date/datetime string as a Date string (i.e. no timestamp)
     * the transformed result is a ISO date string that look like:
     *   2024-05-23T00:00:00.000Z
     */
    asDate(): StringSchema<TType>;
  }

  //   interface BooleanSchema<
  //     TType extends yup.Maybe<boolean> = boolean | undefined,
  //     TContext = yup.AnyObject,
  //     TDefault = undefined,
  //     TFlags extends yup.Flags = '',
  //   > extends yup.Schema<TType, TContext, TDefault, TFlags> {
  //     // onlyOneTruthy(refPath: yup.Reference, msg: string): BooleanSchema<TType>;
  //   }

  interface NumberSchema<TType> extends yup.Schema<TType> {
    /**
     * Accept empty string/NaN, and interpret it as null.
     * Useful for handling input(type=number) when no value is entered
     */
    canBeEmpty(): NumberSchema<TType | null>;
  }

  interface ArraySchema<TIn, TContext, TDefault, TFlags>
    extends yup.Schema<TIn> {
    /**
     * Validate if array contains unique entries
     *
     * @param message message when validation fails
     * @param mapper callback for returning value to use as
     *   uniqueness check
     */
    unique(
      message: string,
      mapper: (item: NonNullable<TIn>[0]) => unknown
    ): ArraySchema<TIn, TContext, TDefault, TFlags>;
  }
}

yup.addMethod<yup.NumberSchema<number | null>>(
  yup.number,
  'canBeEmpty',
  function () {
    return this.nullable().transform((valAsNum, valAsStr) => {
      if (valAsStr() === '') {
        return null;
      }
      const val = Number(valAsNum);
      return Number.isNaN(val) ? null : val;
    });
  }
);

yup.addMethod(
  yup.array,
  'unique',
  function (message, mapper = (item: unknown) => item) {
    return this.test('unique', message, function (list) {
      return list?.length === new Set(list?.map(mapper)).size;
    });
  }
);

yup.addMethod<yup.StringSchema<string | null>>(
  yup.string,
  'asDate',
  function () {
    return this.nullable().transform((val, original) => {
      if (val == null) {
        return null;
      }
      const date = new Date(val);
      if (!isValidDate(date)) {
        return null;
      }
      // Remove timestamp portion of date
      date.setUTCHours(0, 0, 0, 0);
      return date.toISOString();
    });
  }
);
