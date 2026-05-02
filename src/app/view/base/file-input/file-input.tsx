import React from 'react';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { PlainFileInput, type PlainFileInputProps } from './plain-file-input';

export interface FileInputProps<
  P extends FieldValues = FieldValues,
> extends PlainFileInputProps {
  controlName: Path<P>;
}

export const FileInput = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    { controlName, onBlur, onChange, ...props }: FileInputProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const { control } = useFormContext();
    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <PlainFileInput
            ref={mergeRefs(field.ref, ref)}
            onBlur={(evt) => {
              field.onBlur();
              onBlur?.(evt);
            }}
            onChange={(evt) => {
              field.onChange(evt.currentTarget.files);
              onChange?.(evt);
            }}
            errorMessage={fieldState.error?.message}
            isInvalid={fieldState.invalid}
            {...props}
          />
        )}
      />
    );
  }
) as (<P extends FieldValues>(
  props: FileInputProps<P> & {
    ref?: React.ForwardedRef<HTMLInputElement>;
  }
) => React.ReactElement) & { displayName?: string };

FileInput.displayName = 'FileInput';

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createFileInput<P extends FieldValues>() {
  type Props = FileInputProps<P>;

  const component = FileInput as (
    props: Props & { ref?: React.ForwardedRef<HTMLInputElement> }
  ) => React.ReactElement;

  return component;
}
