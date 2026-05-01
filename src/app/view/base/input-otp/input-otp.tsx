import { cn } from '@heroui/react';
import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { PlainInputOtp, type PlainInputOtpProps } from './plain-input-otp';

export interface InputOtpProps<
  P extends FieldValues = FieldValues,
> extends PlainInputOtpProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const InputOtp = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    {
      controlName,
      isControlled,
      onBlur,
      onChange,
      isReadOnly,
      ...props
    }: InputOtpProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <PlainInputOtp
            ref={mergeRefs(ref, field.ref)}
            {...(isControlled
              ? { value: field.value ?? '' }
              : { defaultValue: field.value ?? '' })}
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
            {...props}
          />
        )}
      />
    );
  }
) as (<P extends FieldValues>(
  props: InputOtpProps<P> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement) & { displayName?: string };

InputOtp.displayName = 'InputOtp';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createInputOtp<P extends FieldValues>() {
  type Props = InputOtpProps<P>;

  const component = InputOtp as (
    props: Props & { ref?: React.ForwardedRef<HTMLInputElement> }
  ) => React.ReactElement;

  return component;
}
