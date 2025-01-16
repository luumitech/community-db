import { Input, InputProps } from '@nextui-org/react';
import React from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@nextui-org/react';

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
>(({ controlName, isControlled, onBlur, onChange, ...props }, ref) => {
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
          {...props}
        />
      )}
    />
  );
});

CurrencyInput.displayName = 'CurrencyInput';
