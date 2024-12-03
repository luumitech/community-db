import {
  Input as NextUIInput,
  InputProps as NextUIInputProps,
} from '@nextui-org/react';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@nextui-org/react';

export interface InputProps extends NextUIInputProps {
  controlName: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ controlName, onBlur, onChange, ...props }, ref) => {
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
            ref={ref}
            // Force component to be controlled, so setValue would
            // work properly
            value={field.value ?? null}
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
            {...props}
          />
        )}
      />
    );
  }
);

Input.displayName = 'Input';
