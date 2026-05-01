import { cn } from '@heroui/react';
import React from 'react';
import { NumericFormat, type NumericFormatProps } from 'react-number-format';
import { PlainInput, type PlainInputProps } from '~/view/base/input';

type CustomNumericFormatProps = Omit<NumericFormatProps, ''>;
type CustomInputProps = Omit<PlainInputProps, keyof CustomNumericFormatProps>;

export interface PlainCurrencyInputProps
  extends CustomNumericFormatProps, CustomInputProps {}

export const PlainCurrencyInput = React.forwardRef<
  HTMLInputElement,
  PlainCurrencyInputProps
>(({ classNames, ...props }, ref) => {
  return (
    <NumericFormat
      ref={ref}
      classNames={{
        ...classNames,
        // Render readonly field by removing all input decoration
        base: cn(
          classNames?.base,
          // Enough space for $99.99
          'min-w-20'
        ),
      }}
      // @ts-expect-error conflicting arg 'size' between PlainInput and NumericFormat
      customInput={PlainInput}
      thousandSeparator=","
      decimalSeparator="."
      decimalScale={2}
      fixedDecimalScale
      startContent={
        <div className="pointer-events-none flex items-center">
          <span className="text-sm text-foreground/60">$</span>
        </div>
      }
      onKeyDown={(e) => {
        // Prevent Enter key inside input from submitting form
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
      {...props}
    />
  );
});

PlainCurrencyInput.displayName = 'PlainCurrencyInput';
