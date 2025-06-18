import {
  Input as NextUIInput,
  InputProps as NextUIInputProps,
  cn,
} from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export interface InputProps extends NextUIInputProps {
  controlName: string;
  /**
   * Force component into a controlled component, useful if you need setValue to
   * work properly
   */
  isControlled?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      classNames,
      controlName,
      isControlled,
      onBlur,
      onChange,
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
          <NextUIInput
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
            {...(onClear != null && {
              onClear: () => {
                field.onChange('');
                onClear();
              },
            })}
            errorMessage={error}
            isInvalid={!!error}
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

Input.displayName = 'Input';
