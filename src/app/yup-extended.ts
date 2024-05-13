'use client';
import * as yup from 'yup';

declare module 'yup' {
  //   interface StringSchema<TType extends yup.Maybe<string> = string | undefined>
  //     extends yup.Schema<TType> {
  //     // notEqual(refPath: yup.Reference, msg: string): StringSchema<TType>;
  //   }

  //   interface BooleanSchema<
  //     TType extends yup.Maybe<boolean> = boolean | undefined,
  //     TContext = yup.AnyObject,
  //     TDefault = undefined,
  //     TFlags extends yup.Flags = '',
  //   > extends yup.Schema<TType, TContext, TDefault, TFlags> {
  //     // onlyOneTruthy(refPath: yup.Reference, msg: string): BooleanSchema<TType>;
  //   }

  interface NumberSchema<TType extends yup.Maybe<number>>
    extends yup.Schema<TType> {
    /**
     * Accept empty string, and interpret it as null.
     * Useful for handling input(type=number) when no value is entered
     */
    canBeEmpty(): NumberSchema<TType | null>;
  }
}

yup.addMethod<yup.NumberSchema<number | null>>(
  yup.number,
  'canBeEmpty',
  function () {
    return this.nullable().transform((valAsNum, valAsStr) => {
      return valAsStr === '' ? null : Number(valAsNum);
    });
  }
);
