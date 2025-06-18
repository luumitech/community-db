import { Input, InputProps } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';
import { mergeRefs } from '~/custom-hooks/merge-ref';
import { FlatButton } from '~/view/base/flat-button';

type ReactInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type CustomInputProps = Omit<
  InputProps,
  'readOnly' | 'endContent' | keyof ReactInputProps
>;

export interface FileInputProps extends CustomInputProps, ReactInputProps {
  controlName: string;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ controlName, onBlur, onChange, onClear, ...props }, ref) => {
    const inputRef = useForwardRef<HTMLInputElement>(ref);
    const { control, formState } = useFormContext();
    const { errors } = formState;
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

    const errObj = R.pathOr(errors, R.stringToPath(controlName), {});
    const error = React.useMemo<string | undefined>(() => {
      return errObj?.message as string;
    }, [errObj]);

    return (
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
          errorMessage={error}
          isInvalid={!!error}
          {...(props as CustomInputProps)}
        />
        <Controller
          control={control}
          name={controlName}
          render={({ field }) => (
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
          )}
        />
      </>
    );
  }
);

FileInput.displayName = 'FileInput';
