import { Button, Input, InputProps } from '@nextui-org/react';
import React from 'react';
import { PiFolderOpenDuotone } from 'react-icons/pi';

type ReactInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type CustomInputProps = Omit<
  InputProps,
  'readOnly' | 'endContent' | keyof ReactInputProps
>;

interface Props extends CustomInputProps, ReactInputProps {}

export const FileInput = React.forwardRef<HTMLInputElement, Props>(
  ({ onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [filename, setFilename] = React.useState<string>();

    const onFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = evt.target.files;
      if (fileList?.length) {
        setFilename(fileList[0].name);
      }
      onChange?.(evt);
    };

    return (
      <>
        <Input
          variant="bordered"
          readOnly
          endContent={
            <Button
              className="min-w-max"
              onClick={() => inputRef.current?.click()}
              endContent={<PiFolderOpenDuotone className="text-xl" />}
            >
              Browse...
            </Button>
          }
          value={filename ?? ''}
          {...(props as CustomInputProps)}
        />
        <input
          type="file"
          hidden
          ref={(e) => {
            //@ts-expect-error
            ref?.(e);
            //@ts-expect-error
            inputRef.current = e;
          }}
          {...(props as ReactInputProps)}
          onChange={onFileChange}
        />
      </>
    );
  }
);

FileInput.displayName = 'FileInput';
