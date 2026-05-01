import {
  DatePicker as NextUIDatePicker,
  DatePickerProps as NextUIDatePickerProps,
  cn,
} from '@heroui/react';
import React from 'react';

export interface PlainDatePickerProps extends NextUIDatePickerProps {}

export const PlainDatePicker = React.forwardRef<
  HTMLElement,
  PlainDatePickerProps
>(({ className, ...props }, ref) => {
  return (
    <NextUIDatePicker
      ref={ref}
      // Reserve enough space for 12/31/9999
      className={cn(className, 'min-w-32')}
      {...props}
    />
  );
});

PlainDatePicker.displayName = 'DatePicker';
