import {
  DatePicker as NextUIDatePicker,
  DatePickerProps as NextUIDatePickerProps,
} from '@nextui-org/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { parseAsDate } from '~/lib/date-util';

interface DatePickerProps
  extends Omit<NextUIDatePickerProps, 'onChange' | 'onBlur'> {
  controlName: string;
  /**
   * The onChange/onBlur from the react-hook-form register method is not
   * compatible with the onChange/onBlur onNextUIDatePicker, so we override it
   * with the react-hook-form Controller version
   */
  onChange?: unknown;
  onBlur?: unknown;
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ controlName, onChange, onBlur, ...props }, ref) => {
    const { control, formState } = useFormContext();
    const { errors } = formState;

    const error = React.useMemo<string | undefined>(() => {
      const errObj = R.pathOr(errors, R.stringToPath(controlName), {});
      return errObj?.message as string;
    }, [errors, controlName]);

    /**
     * Ref is not being used right now, so we are introducing a react-hook-form
     * Controller to transform the react-hook-form register values into a
     * uncontrolled component
     */
    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field }) => (
          <NextUIDatePicker
            defaultValue={parseAsDate(field.value)}
            onChange={(val) => {
              field.onChange(val ?? null);
            }}
            errorMessage={error}
            isInvalid={!!error}
            {...props}
          />
        )}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';
