import { cn } from '@heroui/react';
import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import {
  PlainPhoneInput,
  type PlainPhoneInputProps,
} from './plain-phone-input';

export interface PhoneInputProps<
  P extends FieldValues = FieldValues,
> extends PlainPhoneInputProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const PhoneInput = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onChange,
      ...props
    }: PhoneInputProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <PlainPhoneInput
            ref={mergeRefs(field.ref, ref)}
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
  props: PhoneInputProps<P> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement) & { displayName?: string };

PhoneInput.displayName = 'PhoneInput';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createPhoneInput<P extends FieldValues>() {
  type Props = PhoneInputProps<P>;

  const component = PhoneInput as (
    props: Props & { ref?: React.ForwardedRef<HTMLInputElement> }
  ) => React.ReactElement;

  return component;
}
