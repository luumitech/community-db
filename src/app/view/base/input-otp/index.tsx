import {
  InputOtp as NextUIInputOtp,
  InputOtpProps as NextUIInputOtpProps,
  cn,
} from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
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
        render={({ field }) => (
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
            errorMessage={error}
            isInvalid={!!error}
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
