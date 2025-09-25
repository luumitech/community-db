import {
  InputOtp as NextUIInputOtp,
  InputOtpProps as NextUIInputOtpProps,
  cn,
} from '@heroui/react';
import React from 'react';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export interface InputProps extends NextUIInputOtpProps {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const InputOtp = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onChange,
      isReadOnly,
      ...props
    },
    ref
  ) => {
    const { control } = useFormContext();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <NextUIInputOtp
            ref={mergeRefs(ref, field.ref)}
            classNames={{
              ...classNames,
            }}
            defaultValue={field.value ?? ''}
            // Force component into a controlled component
            {...(isControlled && { value: field.value ?? '' })}
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
              isReadOnly: true,
              isDisabled: true,
            })}
            {...props}
          />
        )}
      />
    );
  }
);

InputOtp.displayName = 'InputOtp';
