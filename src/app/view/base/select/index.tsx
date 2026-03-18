import {
  Select as NextUISelect,
  SelectProps as NextUISelectProps,
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

export { SelectItem, SelectSection, type SelectedItems } from '@heroui/react';

export interface SelectProps<
  T extends object = object,
  P extends FieldValues = FieldValues,
> extends NextUISelectProps<T> {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
  /** Remove all decoration and disable interactions to select */
  isReadOnly?: boolean;
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
  <T extends object, P extends FieldValues>(
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onChange,
      isReadOnly,
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
          <NextUISelect<T>
            ref={mergeRefs(field.ref, ref)}
            classNames={{
              ...classNames,
              base: cn(classNames?.base, { 'opacity-100': isReadOnly }),
              trigger: cn(classNames?.trigger, {
                'border-none bg-transparent shadow-none': isReadOnly,
              }),
              selectorIcon: cn({ hidden: isReadOnly }),
            }}
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
            {...(isReadOnly && { isDisabled: true })}
            {...selectProps}
          />
        )}
      />
    );
  }
) as (<T extends object, P extends FieldValues>(
  props: SelectProps<T, P> & { ref?: React.ForwardedRef<HTMLSelectElement> }
) => React.ReactElement) & { displayName?: string };

Select.displayName = 'Select';

/**
 * A Select factory that takes the FieldValues as generic to produce a Select
 * component that would provide type assistance to controlName property
 */
export function createSelect<P extends FieldValues>() {
  type Props<T extends object> = SelectProps<T, P>;

  const component = Select as <T extends object>(
    props: Props<T> & { ref?: React.ForwardedRef<HTMLSelectElement> }
  ) => React.ReactElement;

  return component;
}
