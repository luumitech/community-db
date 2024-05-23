import { Input, InputProps } from '@nextui-org/react';
import React from 'react';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { FlatButton } from '~/view/base/flat-button';

type ReactInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type CustomInputProps = Omit<
  InputProps,
  'readOnly' | 'endContent' | keyof ReactInputProps
>;

interface Props extends CustomInputProps, ReactInputProps {}

export const FileInput = React.forwardRef<HTMLInputElement, Props>(
  ({ onChange, onClear, ...props }, ref) => {
    const inputRef = useForwardRef<HTMLInputElement>(ref);
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
          {...(props as CustomInputProps)}
        />
        <input
          type="file"
          hidden
          ref={inputRef}
          name={props.name}
          onBlur={props.onBlur}
          onChange={onFileChange}
        />
      </>
    );
  }
);

FileInput.displayName = 'FileInput';
