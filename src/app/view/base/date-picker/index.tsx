import {
  DatePickerProps,
  DatePicker as NextUIDatePicker,
} from '@nextui-org/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { parseAsDate } from '~/lib/date-util';

interface Props extends Omit<DatePickerProps, 'onChange' | 'onBlur'> {
  /**
   * The onChange/onBlur from the react-hook-form register method
   * is not compatible with the onChange/onBlur onNextUIDatePicker,
   * so we override it with the react-hook-form Controller version
   */
  onChange?: unknown;
  onBlur?: unknown;
}

export const DatePicker = React.forwardRef<HTMLDivElement, Props>(
  ({ name, onChange, onBlur, ...props }, ref) => {
    const { control } = useFormContext();

    /**
     * ref is not being used right now, so we are
     * introducing a react-hook-form Controller to transform the
     * react-hook-form register values into a uncontrolled component
     */
    return (
      <Controller
        control={control}
        name={name ?? ''}
        render={({ field }) => (
          <NextUIDatePicker
            defaultValue={parseAsDate(field.value)}
            onChange={(val) => {
              field.onChange(val ?? null);
            }}
            {...props}
          />
        )}
      />
    );
  }
);

DatePicker.displayName = 'DatePicker';
