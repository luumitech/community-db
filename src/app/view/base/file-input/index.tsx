import { Input, InputProps } from '@heroui/react';
import React from 'react';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { FlatButton } from '~/view/base/flat-button';

type ReactInputProps = React.ComponentProps<'input'>;
type CustomInputProps = Omit<
  InputProps,
  'readOnly' | 'endContent' | keyof ReactInputProps
>;

export interface FileInputProps<P extends FieldValues = FieldValues>
  extends CustomInputProps, ReactInputProps {
  controlName: Path<P>;
}

export const FileInput = React.forwardRef(
  <P extends FieldValues = FieldValues>(
    { controlName, onBlur, onChange, onClear, ...props }: FileInputProps<P>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    const inputRef = useForwardRef<HTMLInputElement>(ref);
    const { control } = useFormContext();
    const [filename, setFilename] = React.useState<string>();

    const onFileChange = React.useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = evt.target.files;
        if (fileList?.length) {
          setFilename(fileList[0].name);
        }
        onChange?.(evt);
      },
      [onChange]
    );

    const onBrowse = React.useCallback(() => {
      if (!filename) {
        inputRef.current?.click();
      }
    }, [filename, inputRef]);

    const onFileClear = () => {
      inputRef.current.value = '';
      setFilename(undefined);
      onClear?.();
    };

    return (
      <Controller
        control={control}
        name={controlName}
        render={({ field, fieldState }) => (
          <>
            <Input
              variant="bordered"
              readOnly
              endContent={
                filename ? (
                  <FlatButton icon="clear" onClick={onFileClear} />
                ) : (
                  <FlatButton icon="folder-open" onClick={onBrowse} />
                )
              }
              value={filename ?? ''}
              onClick={onBrowse}
              errorMessage={fieldState.error?.message}
              isInvalid={fieldState.invalid}
              {...(props as CustomInputProps)}
            />
            <input
              type="file"
              hidden
              ref={mergeRefs(field.ref, inputRef)}
              onBlur={(evt) => {
                field.onBlur();
                onBlur?.(evt);
              }}
              onChange={(evt) => {
                field.onChange(evt.currentTarget.files);
                onFileChange(evt);
              }}
            />
          </>
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
