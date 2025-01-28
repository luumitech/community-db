import {
  Select as NextUISelect,
  SelectProps as NextUISelectProps,
} from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@heroui/react';

export interface SelectProps<T extends object = object>
  extends NextUISelectProps<T> {
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
 * Returns null if:
 *
 * - Input is a number but a NaN
 * - Input is a empty string
 */
function coerceToString(input: string | number) {
  if (typeof input === 'number') {
    return isNaN(input) ? null : input.toString();
  }

  return R.isEmpty(input) ? null : input;
}

export function Select<T extends object>(props: SelectProps<T>) {
  const SelectImpl = React.forwardRef<HTMLSelectElement | null, SelectProps<T>>(
    ({ controlName, isControlled, onBlur, onChange, ...selectProps }, ref) => {
      const { control, formState } = useFormContext();
      const { errors } = formState;

      const errObj = R.pathOr(errors, R.stringToPath(controlName), {});
      const error = React.useMemo<string | undefined>(() => {
        return errObj?.message as string;
      }, [errObj]);

      const selectedKeys = React.useCallback(
        (values: string | number | string[] | number[]) => {
          if (values == null) {
            return [];
          }

          const result = Array.isArray(values)
            ? values.map(coerceToString)
            : [coerceToString(values)];
          return result.filter((v): v is string => v !== null);
        },
        []
      );

      return (
        <Controller
          control={control}
          name={controlName}
          render={({ field }) => (
            <NextUISelect<T>
              ref={ref}
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
              errorMessage={error}
              isInvalid={!!error}
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
