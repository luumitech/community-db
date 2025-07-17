import {
  NumberInput as NextUINumberInput,
  NumberInputProps as NextUINumberInputProps,
  cn,
} from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export interface NumberInputProps extends NextUINumberInputProps {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onClear,
      onValueChange,
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
          <NextUINumberInput
            ref={mergeRefs(field.ref, ref)}
            classNames={{
              ...classNames,
              // Render readonly field by removing all input decoration
              base: cn(classNames?.base, {
                'opacity-100': isReadOnly,
              }),
              inputWrapper: cn(classNames?.inputWrapper, {
                'border-none shadow-none bg-transparent': isReadOnly,
              }),
            }}
            defaultValue={field.value ?? NaN}
            // Force component into a controlled component
            {...(isControlled && { value: field.value ?? NaN })}
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
            errorMessage={error}
            isInvalid={!!error}
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
);

NumberInput.displayName = 'NumberInput';
