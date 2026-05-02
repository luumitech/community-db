import React from 'react';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { FlatButton } from '~/view/base/flat-button';
import { PlainInput, type PlainInputProps } from '~/view/base/input';

type ReactInputProps = React.ComponentProps<'input'>;
type CustomInputProps = Omit<
  PlainInputProps,
  'readOnly' | 'endContent' | keyof ReactInputProps
>;

export interface PlainFileInputProps
  extends CustomInputProps, ReactInputProps {}

export const PlainFileInput = React.forwardRef<
  HTMLInputElement,
  PlainFileInputProps
>(({ onChange, onBlur, onClear, ...props }, ref) => {
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
      <PlainInput
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
        onBlur={onBlur}
        onChange={onFileChange}
      />
    </>
  );
});

PlainFileInput.displayName = 'PlainFileInput';
