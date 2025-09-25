import {
  Autocomplete as NextUIAutocomplete,
  AutocompleteProps as NextUIAutocompleteProps,
  cn,
} from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export { AutocompleteItem, AutocompleteSection } from '@heroui/react';

export interface AutocompleteProps<T extends object = object>
  extends NextUIAutocompleteProps<T> {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

/**
 * Coerce string or numeric type to string
 *
 * Returns empty string if:
 *
 * - Input is a number but a NaN
 * - Input is a empty string
 */
function coerceToString(input: string | boolean | number) {
  if (typeof input === 'number') {
    return isNaN(input) ? '' : input.toString().trim();
  }
  if (typeof input === 'boolean') {
    return input ? 'true' : 'false';
  }

  return R.isEmpty(input) ? '' : input.trim();
}

export function Autocomplete<T extends object>(props: AutocompleteProps<T>) {
  const AutocompleteImpl = React.forwardRef<
    HTMLInputElement | null,
    AutocompleteProps<T>
  >(
    (
      {
        classNames,
        controlName,
        isControlled,
        onBlur,
        onClear,
        ...selectProps
      },
      ref
    ) => {
      const { control } = useFormContext();

      return (
        <Controller
          control={control}
          name={controlName}
          render={({ field, fieldState }) => (
            <NextUIAutocomplete<T>
              key="abc"
              ref={mergeRefs(field.ref, ref)}
              classNames={{
                ...classNames,
              }}
              // Force component into a controlled component
              {...(isControlled && {
                value: coerceToString(field.value),
              })}
              defaultInputValue={coerceToString(field.value)}
              onInputChange={(val) => {
                field.onChange(val);
              }}
              onBlur={(evt) => {
                field.onBlur();
                onBlur?.(evt);
              }}
              errorMessage={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              {...selectProps}
            />
          )}
        />
      );
    }
  );

  AutocompleteImpl.displayName = 'Autocomplete';
  return <AutocompleteImpl {...props} />;
}
