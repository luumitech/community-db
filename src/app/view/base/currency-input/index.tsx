import { Input, InputProps, cn } from '@heroui/react';
import React from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@heroui/react';

type CustomInputProps = Omit<InputProps, keyof NumericFormatProps>;

export interface CurrencyInputProps
  extends NumericFormatProps,
    CustomInputProps {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
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
          <NumericFormat
            ref={ref}
            classNames={{
              ...classNames,
              // Render readonly field by removing all input decoration
              base: cn(
                classNames?.base,
                // Enough space for $99.99
                'min-w-20',
                { 'opacity-100': isReadOnly }
              ),
              inputWrapper: cn(classNames?.inputWrapper, {
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
            thousandSeparator=","
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
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

CurrencyInput.displayName = 'CurrencyInput';
