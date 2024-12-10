import { toCalendarDate } from '@internationalized/date';
import {
  DatePicker as NextUIDatePicker,
  DatePickerProps as NextUIDatePickerProps,
} from '@nextui-org/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { parseAsDate } from '~/lib/date-util';

interface DatePickerProps extends NextUIDatePickerProps {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ controlName, isControlled, onChange, onBlur, ...props }, ref) => {
    const { control, formState } = useFormContext();
    const { errors } = formState;

    const errObj = R.pathOr(errors, R.stringToPath(controlName), {});
    const error = React.useMemo<string | undefined>(() => {
      return errObj?.message as string;
    }, [errObj]);

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field }) => {
          const dateVal = parseAsDate(field.value);
          const value = dateVal ? toCalendarDate(dateVal) : null;

          return (
            <NextUIDatePicker
              ref={ref}
              // Force component into a controlled component
              {...(isControlled && { value })}
              defaultValue={value}
              onBlur={(evt) => {
                field.onBlur();
                onBlur?.(evt);
              }}
              onChange={(val) => {
                const date = val ?? null;
                field.onChange(date);
                onChange?.(date);
              }}
              errorMessage={error}
              isInvalid={!!error}
              {...props}
            />
          );
        }}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';
