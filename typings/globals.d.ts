type OnlyNumIsNullable<T> = T extends number ? Nullable<T> : NonNullable<T>;

/**
 * Convert each property into a required field (i.e. no null/undefined)
 * recursively.
 *
 * The purpose is to generate 'defaultValues' props for input fields for
 * use in react-hook-form.  This would allow all input fields to be rendered
 * as uncontrolled component
 *
 * - Special handling for the following data type, as they should not be
 *   recursed into:
 *   - Date
 *   - FileList
 * - for number input field, use null to represent empty value
 * - for string input field, use '' to represent empty value
 */
type DefaultInput<T> = {
  [P in keyof T]-?: OnlyNumIsNullable<
    T[P] extends Date | FileList ? T[P] : DefaultInput<T[P]>
  >;
};
