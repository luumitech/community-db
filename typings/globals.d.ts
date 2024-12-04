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
