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
                className="p-2 -m-2 opacity-50 hover:opacity-100"
              >
                <MdOutlineClear
                  className="text-2xl cursor-pointer"
                  onClick={onFileClear}
                />
              </span>
            ) : (
              <span
                role="button"
                className="p-2 -m-2 opacity-50 hover:opacity-100"
              >
                <FaFolderOpen
                  className="text-2xl cursor-pointer"
                  onClick={() => inputRef.current?.click()}
                />
              </span>
            )
          }
          value={filename ?? ''}
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
