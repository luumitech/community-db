import {
  DatePicker as NextUIDatePicker,
  DatePickerProps as NextUIDatePickerProps,
  cn,
} from '@heroui/react';
import { toCalendarDate } from '@internationalized/date';
import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { parseAsDate } from '~/lib/date-util';

interface DatePickerProps<
  P extends FieldValues = FieldValues,
> extends NextUIDatePickerProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const DatePicker = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    {
      className,
      controlName,
      isControlled,
      onChange,
      onBlur,
      ...props
    }: DatePickerProps<P>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => {
          const dateVal = parseAsDate(field.value);
          const value = dateVal ? toCalendarDate(dateVal) : null;

          return (
            <NextUIDatePicker
              ref={mergeRefs(field.ref, ref)}
              // Reserve enough space for 12/31/9999
              className={cn(className, 'min-w-32')}
              {...(isControlled ? { value } : { defaultValue: value })}
              onBlur={(evt) => {
                field.onBlur();
                onBlur?.(evt);
              }}
              onChange={(val) => {
                const date = val ?? null;
                field.onChange(date);
                onChange?.(date);
              }}
              errorMessage={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              {...props}
            />
          );
        }}
      />
    );
  }
) as (<P extends FieldValues>(
  props: DatePickerProps<P> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  }
) => React.ReactElement) & { displayName?: string };

DatePicker.displayName = 'DatePicker';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createDatePicker<P extends FieldValues>() {
  type Props = DatePickerProps<P>;

  const component = DatePicker as (
    props: Props & { ref?: React.ForwardedRef<HTMLDivElement> }
  ) => React.ReactElement;

  return component;
}
