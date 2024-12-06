import {
  Textarea as NextUITextarea,
  TextAreaProps as NextUITextareaProps,
} from '@nextui-org/input';
import React from 'react';
import * as R from 'remeda';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@nextui-org/react';

export interface TextareaProps extends NextUITextareaProps {
  controlName: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
          <NextUITextarea
            ref={ref}
            defaultValue={field.value ?? ''}
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

Textarea.displayName = 'Textarea';
