import { Input, InputProps, cn } from '@heroui/react';
import React from 'react';
import { PatternFormat, type PatternFormatProps } from 'react-number-format';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export { SelectItem, SelectSection } from '@heroui/react';

type CustomPatternFormatProps = Omit<PatternFormatProps, 'format'>;
type CustomInputProps = Omit<InputProps, keyof CustomPatternFormatProps>;

export interface PhoneInputProps
  extends CustomPatternFormatProps,
    CustomInputProps {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
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
          <PatternFormat
            ref={mergeRefs(field.ref, ref)}
            classNames={{
              ...classNames,
              // Render readonly field by removing all input decoration
              base: cn(
                classNames?.base,
                // Enough space for (999)999-9999
                'min-w-40 font-mono',
                { 'opacity-100': isReadOnly }
              ),
              inputWrapper: cn(classNames?.inputWrapper, {
                'border-none bg-transparent shadow-none': isReadOnly,
              }),
            }}
            // @ts-expect-error conflicting arg 'size' between Input and NumericFormat
            customInput={Input}
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
            format="(###)###-####"
            mask="_"
            allowEmptyFormatting
            onKeyDown={(e) => {
              // Prevent Enter key inside input from submitting form
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
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

PhoneInput.displayName = 'PhoneInput';
