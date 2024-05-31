import React from 'react';
import {
  useForm as useRHFForm,
  type FieldError,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form';

export {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
  type UseFieldArrayReturn,
} from 'react-hook-form';

/**
 * Find the first FieldError in the errors object
 * @param errors
 * @returns
 */
function findFirstError(errors?: FieldErrors): FieldError | undefined {
  for (const errorEntry of Object.values(errors ?? {})) {
    const validError = errorEntry?.message
      ? (errorEntry as FieldError)
      : findFirstError(errorEntry as Record<string, FieldError>);
    if (validError) {
      return validError;
    }
  }
}

/**
 * Custom react-hook-form useForm, that would monitor errors, and scroll
 * to the first element containing error
 *
 * @param args useForm arguments
 * @returns
 */
export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(
  ...args: Parameters<
    typeof useRHFForm<TFieldValues, TContext, TTransformedValues>
  >
) {
  const formMethods = useRHFForm<TFieldValues, TContext, TTransformedValues>(
    ...args
  );
  const {
    formState: { errors },
  } = formMethods;

  React.useEffect(() => {
    const firstError = findFirstError(errors);
    firstError?.ref?.scrollIntoView?.({ behavior: 'smooth' });
  }, [errors]);

  return formMethods;
}
