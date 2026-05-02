import { cn } from '@heroui/react';
import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import {
  PlainInputEmail,
  type PlainInputEmailProps,
} from './plain-input-email';

export interface InputEmailProps<
  P extends FieldValues = FieldValues,
> extends PlainInputEmailProps {
  controlName: Path<P>;
}

export function InputEmail<P extends FieldValues = FieldValues>({
  className,
  controlName,
  onBlur,
  onChange,
  ...props
}: InputEmailProps<P>) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={controlName}
      render={({ field, fieldState }) => (
        <PlainInputEmail
          emails={field.value}
          onBlur={() => {
            field.onBlur();
            onBlur?.();
          }}
          onChange={(emails) => {
            field.onChange(emails);
            onChange?.(emails);
          }}
          errorMessage={fieldState.error?.message}
          isInvalid={fieldState.invalid}
          {...props}
        />
      )}
    />
  );
}

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createInputEmail<P extends FieldValues>() {
  type Props = InputEmailProps<P>;

  const component = InputEmail as (props: Props) => React.ReactElement;
  return component;
}
