/**
 * Convert each property into a required field (i.e. no null/undefined)
 * recursively.
 *
 * The purpose is to generate 'defaultValues' props for input fields for use in
 * react-hook-form. This would allow all input fields to be rendered as
 * uncontrolled component
 *
 * - Special handling for the following data type, as they should not be recursed
 *   into:
 *
 *   - Date
 *   - FileList
 * - For number input field, use NaN to represent empty value
 * - For string input field, use '' to represent empty value
 */
type DefaultInput<T> = {
  [P in keyof T]-?: NonNullable<
    T[P] extends Date | FileList ? T[P] : DefaultInput<T[P]>
  >;
};

/*
 * Matches any function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...arg: any) => any;

/** Change the return type of a function */
type ReplaceReturnType<T extends AnyFunction, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn;

/** Use to provide typing to dispatch from useReducer */
type AnyDispatch<State> = import('@reduxjs/toolkit').ThunkDispatch<
  State,
  unknown,
  { type: '' }
>;

/** Use to give typing to @reduxjs/toolkit's bindActionCreators */
type ActionCreatorMap<T extends Record<string, AnyFunction>> = {
  [K in keyof T]: ReplaceReturnType<T[K], void>;
};
