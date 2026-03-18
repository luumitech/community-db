import {
  CheckboxGroup as NextUICheckboxGroup,
  cn,
  type CheckboxGroupProps as NextUICheckboxGroupProps,
} from '@heroui/react';
import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';

export interface CheckboxGroupProps<
  P extends FieldValues = FieldValues,
> extends NextUICheckboxGroupProps {
  controlName: Path<P>;
}

export const CheckboxGroup = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    { controlName, ...checkboxProps }: CheckboxGroupProps<P>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    const { control } = useFormContext<P>();

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <NextUICheckboxGroup
            ref={mergeRefs(field.ref, ref)}
            value={field.value}
            onValueChange={field.onChange}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            {...checkboxProps}
          />
        )}
      />
    );
  }
) as (<P extends FieldValues = FieldValues>(
  props: CheckboxGroupProps<P> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement) & { displayName?: string };

CheckboxGroup.displayName = 'CheckboxGroup';
