import {
  Textarea as NextUITextarea,
  TextAreaProps as NextUITextareaProps,
} from '@heroui/input';
import React from 'react';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export { SelectItem, SelectSection } from '@heroui/react';

export interface TextareaProps extends NextUITextareaProps {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ controlName, isControlled, onBlur, onChange, ...props }, ref) => {
    const { control } = useFormContext();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <NextUITextarea
            ref={mergeRefs(field.ref, ref)}
            // Force component into a controlled component
            {...(isControlled && { value: field.value ?? '' })}
            defaultValue={field.value ?? ''}
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
);

Textarea.displayName = 'Textarea';
