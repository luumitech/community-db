import { cn } from '@heroui/react';
import React from 'react';
import { PatternFormat, type PatternFormatProps } from 'react-number-format';
import { PlainInput, type PlainInputProps } from '~/view/base/input';

type CustomPatternFormatProps = Omit<PatternFormatProps, 'format'>;
type CustomInputProps = Omit<PlainInputProps, keyof CustomPatternFormatProps>;

export interface PlainPhoneInputProps
  extends CustomPatternFormatProps, CustomInputProps {}

export const PlainPhoneInput = React.forwardRef<
  HTMLInputElement,
  PlainPhoneInputProps
>(({ classNames, ...props }, ref) => {
  return (
    <PatternFormat
      ref={ref}
      classNames={{
        ...classNames,
        // Render readonly field by removing all input decoration
        base: cn(
          classNames?.base,
          // Enough space for (999)999-9999
          'min-w-40 font-mono'
        ),
      }}
      // @ts-expect-error conflicting arg 'size' between PlainInput and NumericFormat
      customInput={PlainInput}
      format="(###)###-####"
      mask="_"
      allowEmptyFormatting
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

PlainPhoneInput.displayName = 'PlainPhoneInput';
