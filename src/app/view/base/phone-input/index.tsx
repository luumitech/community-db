import { Input, InputProps } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { PatternFormat, type PatternFormatProps } from 'react-number-format';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

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
          <PatternFormat
            ref={ref}
            classNames={{
              ...classNames,
              // Render readonly field by removing all input decoration
              base: clsx(
                classNames?.base,
                // Enough space for (999)999-9999
                'min-w-40 font-mono',
                { 'opacity-100': isReadOnly }
              ),
              inputWrapper: clsx(classNames?.inputWrapper, {
                'border-none shadow-none bg-transparent': isReadOnly,
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
            errorMessage={error}
            isInvalid={!!error}
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
