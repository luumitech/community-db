import {
  Input as NextUIInput,
  InputProps as NextUIInputProps,
  cn,
} from '@heroui/react';
import React from 'react';

export interface PlainInputProps extends NextUIInputProps {}

export const PlainInput = React.forwardRef<HTMLInputElement, PlainInputProps>(
  ({ classNames, isReadOnly, ...props }, ref) => {
    return (
      <NextUIInput
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
        {...(!!isReadOnly && {
          isReadOnly: true,
          isDisabled: true,
        })}
        {...props}
      />
    );
  }
);

PlainInput.displayName = 'PlainInput';
