import {
  Select as NextUISelect,
  SelectProps as NextUISelectProps,
} from '@nextui-org/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@nextui-org/react';

export interface SelectProps<T extends object = object>
  extends NextUISelectProps<T> {
  controlName: string;
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
  const SelectImpl = React.forwardRef<HTMLSelectElement, SelectProps<T>>(
    ({ controlName, onSelectionChange, ...selectProps }, ref) => {
      const { control, formState } = useFormContext();
      const { errors } = formState;

      const error = React.useMemo<string | undefined>(() => {
        const errObj = R.pathOr(errors, R.stringToPath(controlName), {});
        return errObj?.message as string;
      }, [errors, controlName]);

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

      /**
       * Ref is not being used right now, so we are introducing a
       * react-hook-form Controller to transform the react-hook-form register
       * values into a uncontrolled component
       */
      return (
        <Controller
          control={control}
          name={controlName}
          render={({ field }) => (
            <NextUISelect<T>
              ref={ref}
              selectedKeys={selectedKeys(field.value)}
              onSelectionChange={(keys) => {
                field.onChange(
                  selectProps.selectionMode === 'multiple'
                    ? [...keys]
                    : keys.currentKey ?? null
                );
                onSelectionChange?.(keys);
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
