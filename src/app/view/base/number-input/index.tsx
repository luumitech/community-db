import {
  NumberInput as NextUINumberInput,
  NumberInputProps as NextUINumberInputProps,
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

export interface NumberInputProps<
  P extends FieldValues = FieldValues,
> extends NextUINumberInputProps {
  controlName: Path<P>;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const NumberInput = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onClear,
      onValueChange,
      isReadOnly,
      ...props
    }: NumberInputProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <NextUINumberInput
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
            // Force component into a controlled component
            {...(isControlled
              ? { value: field.value ?? NaN }
              : { defaultValue: field.value ?? NaN })}
            onBlur={(evt) => {
              field.onBlur();
              onBlur?.(evt);
            }}
            onValueChange={(val) => {
              field.onChange(val);
              onValueChange?.(val);
            }}
            {...(!!props.isClearable && {
              onClear: () => {
                field.onChange('');
                onClear?.();
              },
            })}
            onKeyDown={(e) => {
              // Prevent Enter key inside input from submitting form
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            labelPlacement="inside"
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
  props: NumberInputProps<P> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement) & { displayName?: string };

NumberInput.displayName = 'NumberInput';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createNumberInput<P extends FieldValues>() {
  type Props = NumberInputProps<P>;

  const component = NumberInput as (
    props: Props & { ref?: React.ForwardedRef<HTMLInputElement> }
  ) => React.ReactElement;

  return component;
}
