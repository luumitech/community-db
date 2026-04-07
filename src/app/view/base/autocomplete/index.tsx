import {
  Autocomplete as NextUIAutocomplete,
  AutocompleteProps as NextUIAutocompleteProps,
  cn,
} from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export { AutocompleteItem, AutocompleteSection } from '@heroui/react';

export interface AutocompleteProps<
  T extends object = object,
  P extends FieldValues = FieldValues,
> extends NextUIAutocompleteProps<T> {
  controlName: Path<P>;
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

const Autocomplete = React.forwardRef(
  <T extends object, P extends FieldValues = FieldValues>(
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onClear,
      ...selectProps
    }: AutocompleteProps<T, P>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <NextUIAutocomplete<T>
            ref={mergeRefs(field.ref, ref)}
            classNames={{
              ...classNames,
            }}
            {...(isControlled
              ? { value: coerceToString(field.value) }
              : { defaultInputValue: coerceToString(field.value) })}
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
) as (<T extends object, P extends FieldValues>(
  props: AutocompleteProps<T, P> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  }
) => React.ReactElement) & { displayName?: string };

Autocomplete.displayName = 'Autocomplete';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createAutocomplete<P extends FieldValues>() {
  type Props<T extends object> = AutocompleteProps<T, P>;

  const component = Autocomplete as <T extends object>(
    props: Props<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
  ) => React.ReactElement;

  return component;
}
