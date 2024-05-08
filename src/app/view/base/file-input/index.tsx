import { Input, InputProps } from '@nextui-org/react';
import React from 'react';
import { FaFolderOpen } from 'react-icons/fa';
import { MdOutlineClear } from 'react-icons/md';

type ReactInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type CustomInputProps = Omit<
  InputProps,
  'readOnly' | 'endContent' | keyof ReactInputProps
>;

interface Props extends CustomInputProps, ReactInputProps {}

export const FileInput = React.forwardRef<HTMLInputElement, Props>(
  ({ onChange, onClear, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [filename, setFilename] = React.useState<string>();

    const onFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = evt.target.files;
      if (fileList?.length) {
        setFilename(fileList[0].name);
      }
      onChange?.(evt);
    };

    const onBrowse = React.useCallback(() => {
      if (!filename) {
        inputRef.current?.click();
      }
    }, [filename]);

    const onFileClear = () => {
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
              <span
                role="button"
                className="opacity-80 hover:opacity-100 active:opacity-50"
              >
                <MdOutlineClear
                  className="text-xl cursor-pointer"
                  onClick={onFileClear}
                />
              </span>
            ) : (
              <span
                role="button"
                className="opacity-80 hover:opacity-100 active:opacity-50"
              >
                <FaFolderOpen
                  className="text-xl cursor-pointer"
                  onClick={onBrowse}
                />
              </span>
            )
          }
          value={filename ?? ''}
          onClick={onBrowse}
          {...(props as CustomInputProps)}
        />
        <input
          type="file"
          hidden
          ref={(e) => {
            //@ts-expect-error: forward ref into input field
            ref?.(e);
            //@ts-expect-error: forward ref into input field
            inputRef.current = e;
          }}
          name={props.name}
          onBlur={props.onBlur}
          onChange={onFileChange}
        />
      </>
    );
  }
);

FileInput.displayName = 'FileInput';
