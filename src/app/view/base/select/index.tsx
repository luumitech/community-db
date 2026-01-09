import {
  Select as NextUISelect,
  SelectProps as NextUISelectProps,
  cn,
} from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export { SelectItem, SelectSection } from '@heroui/react';

export interface SelectProps<
  T extends object = object,
> extends NextUISelectProps<T> {
  controlName: string;
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

export function Select<T extends object>(props: SelectProps<T>) {
  const SelectImpl = React.forwardRef<HTMLSelectElement | null, SelectProps<T>>(
    (
      {
        classNames,
        controlName,
        isControlled,
        onBlur,
        onChange,
        isReadOnly,
        ...selectProps
      },
      ref
    ) => {
      const { control } = useFormContext();

      const selectedKeys = React.useCallback(
        (values: string | number | string[] | number[]) => {
          if (values == null) {
            return [];
          } else if (values === 'all') {
            return 'all';
          }

          const result = Array.isArray(values)
            ? values.map(coerceToString)
            : coerceToString(values).split(',');
          const keys = result.filter((v): v is string => !!v);
          return keys;
        },
        []
      );

      return (
        <Controller
          control={control}
          name={controlName}
          render={({ field, fieldState }) => (
            <NextUISelect<T>
              ref={mergeRefs(field.ref, ref)}
              classNames={{
                ...classNames,
                // Render readonly field by removing all input decoration
                base: cn(classNames?.base, {
                  'opacity-100': isReadOnly,
                }),
                trigger: cn(classNames?.trigger, {
                  'border-none bg-transparent shadow-none': isReadOnly,
                }),
                selectorIcon: cn({
                  hidden: isReadOnly,
                }),
              }}
              // Force component into a controlled component
              {...(isControlled && { selectedKeys: selectedKeys(field.value) })}
              defaultSelectedKeys={selectedKeys(field.value)}
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
              {...(!!isReadOnly && {
                isDisabled: true,
              })}
              {...selectProps}
            />
          )}
        />
      );
    }
  );

  SelectImpl.displayName = 'Select';
  return <SelectImpl {...props} />;
}
