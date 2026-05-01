import {
  NumberInput as NextUINumberInput,
  NumberInputProps as NextUINumberInputProps,
  cn,
} from '@heroui/react';
import React from 'react';

export interface PlainNumberInputProps extends NextUINumberInputProps {}

export const PlainNumberInput = React.forwardRef<
  HTMLInputElement,
  PlainNumberInputProps
>(({ classNames, isReadOnly, ...props }, ref) => {
  return (
    <NextUINumberInput
      ref={ref}
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
      onKeyDown={(e) => {
        // Prevent Enter key inside input from submitting form
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
      labelPlacement="inside"
      {...(!!isReadOnly && {
        isReadOnly: true,
        isDisabled: true,
      })}
      {...props}
    />
  );
});

PlainNumberInput.displayName = 'PlainNumberInput';
