import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { PlainTextarea, type PlainTextareaProps } from './plain-textarea';

export interface TextareaProps<
  P extends FieldValues = FieldValues,
> extends PlainTextareaProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const Textarea = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    { controlName, isControlled, onBlur, onChange, ...props }: TextareaProps<P>,
    ref: React.ForwardedRef<HTMLTextAreaElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <PlainTextarea
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
  props: TextareaProps<P> & {
    ref?: React.ForwardedRef<HTMLTextAreaElement>;
  }
) => React.ReactElement) & { displayName?: string };

Textarea.displayName = 'Textarea';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createTextarea<P extends FieldValues>() {
  type Props = TextareaProps<P>;

  const component = Textarea as (
    props: Props & { ref?: React.ForwardedRef<HTMLTextAreaElement> }
  ) => React.ReactElement;

  return component;
}
