import { cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import {
  PlainSelect,
  type PlainSelectProps,
  type SelectItem,
} from './plain-select';

export interface SelectProps<
  T extends SelectItem = SelectItem,
  P extends FieldValues = FieldValues,
> extends PlainSelectProps<T> {
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

function toSelectedKeys(values: string | number | string[] | number[]) {
  if (values == null) {
    return [];
  }
  if (values === 'all') {
    return 'all' as const;
  }
  const result = Array.isArray(values)
    ? values.map(coerceToString)
    : coerceToString(values).split(',');
  return result.filter((v): v is string => !!v);
}

export const Select = React.forwardRef(
  <T extends SelectItem, P extends FieldValues>(
    {
      controlName,
      isControlled,
      onBlur,
      onChange,
      ...selectProps
    }: SelectProps<T, P>,
    ref: React.ForwardedRef<HTMLSelectElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <PlainSelect<T>
            ref={mergeRefs(field.ref, ref)}
            {...(isControlled
              ? { selectedKeys: toSelectedKeys(field.value) }
              : { defaultSelectedKeys: toSelectedKeys(field.value) })}
            onBlur={(evt) => {
              field.onBlur();
              onBlur?.(evt);
            }}
            onChange={(evt) => {
              field.onChange(evt);
              onChange?.(evt);
            }}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            {...selectProps}
          />
        )}
      />
    );
  }
) as (<T extends SelectItem, P extends FieldValues>(
  props: SelectProps<T, P> & { ref?: React.ForwardedRef<HTMLSelectElement> }
) => React.ReactElement) & { displayName?: string };

Select.displayName = 'Select';

/**
 * A Select factory that takes the FieldValues as generic to produce a Select
 * component that would provide type assistance to controlName property
 */
export function createSelect<P extends FieldValues>() {
  type Props<T extends SelectItem = SelectItem> = SelectProps<T, P>;

  const component = Select as <T extends SelectItem = SelectItem>(
    props: Props<T> & { ref?: React.ForwardedRef<HTMLSelectElement> }
  ) => React.ReactElement;

  return component;
}
