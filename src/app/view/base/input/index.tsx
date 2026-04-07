import {
  Input as NextUIInput,
  InputProps as NextUIInputProps,
  cn,
} from '@heroui/react';
import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export interface InputProps<
  P extends FieldValues = FieldValues,
> extends NextUIInputProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const Input = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onChange,
      onClear,
      onValueChange,
      isReadOnly,
      ...props
    }: InputProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <NextUIInput
            ref={mergeRefs(field.ref, ref)}
            classNames={{
              ...classNames,
              // Render readonly field by removing all input decoration
              base: cn(classNames?.base, {
                'opacity-100': isReadOnly,
              }),
              inputWrapper: cn(classNames?.inputWrapper, {
                'border-none bg-transparent shadow-none': isReadOnly,
              }),
            }}
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
            {...(!!props.isClearable && {
              onClear: () => {
                field.onChange('');
                onClear?.();
              },
            })}
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
) as (<P extends FieldValues>(
  props: InputProps<P> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement) & { displayName?: string };

Input.displayName = 'Input';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createInput<P extends FieldValues>() {
  type Props = InputProps<P>;

  const component = Input as (
    props: Props & { ref?: React.ForwardedRef<HTMLInputElement> }
  ) => React.ReactElement;

  return component;
}
