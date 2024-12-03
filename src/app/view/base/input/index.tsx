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

    /**
     * Ref is not being used right now, so we are introducing a react-hook-form
     * Controller to transform the react-hook-form register values into a
     * uncontrolled component
     */
    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field }) => (
          <NextUIInput
            ref={ref}
            value={field.value}
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
