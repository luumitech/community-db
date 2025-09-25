import { Chip, cn } from '@heroui/react';
import React from 'react';
import { ReactMultiEmail, type IReactMultiEmailProps } from 'react-multi-email';
import { Controller, useFormContext } from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@heroui/react';

type CustomReactMultiEmailProps = Omit<IReactMultiEmailProps, 'getLabel'>;

export interface InputEmailProps extends CustomReactMultiEmailProps {
  controlName: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

/** ReactMultiEmail is only available in controlled form */
export const InputEmail: React.FC<InputEmailProps> = ({
  className,
  controlName,
  label,
  onBlur,
  onChange,
  description,
  ...props
}) => {
  const { control } = useFormContext();

  const getLabel = React.useCallback<IReactMultiEmailProps['getLabel']>(
    (email, index, removeEmail) => {
      return (
        <Chip key={index} size="sm" onClose={() => removeEmail(index)}>
          {email}
        </Chip>
      );
    },
    []
  );

  return (
    <Controller
      control={control}
      name={controlName}
      render={({ field, fieldState }) => (
        <div className={className}>
          <div
            className={cn(
              'border-medium border-default-200 hover:border-default-400',
              'focus-within:border-default-foreground',
              'px-3 py-2 rounded-medium',
              { 'border-danger': fieldState.invalid }
            )}
          >
            {label && (
              <label
                className={cn(
                  'z-10 pointer-events-none text-default-600 cursor-text',
                  'text-xs pb-0.5 pe-2 max-w-full text-ellipsis overflow-hidden',
                  { 'text-danger': fieldState.invalid }
                )}
              >
                {label}
              </label>
            )}
            <ReactMultiEmail
              emails={field.value}
              className="flex flex-wrap gap-2 items-center"
              inputClassName={cn(
                'font-normal placeholder:text-foreground-500 bg-clip-text text-small',
                'focus-visible:outline-none',
                'flex-grow'
              )}
              onBlur={() => {
                field.onBlur();
                onBlur?.();
              }}
              onChange={(emails) => {
                field.onChange(emails);
                onChange?.(emails);
              }}
              getLabel={getLabel}
              {...props}
            />
          </div>
          {(!!description || !!fieldState.error?.message) && (
            <div className="p-1 flex-col gap-1.5">
              <div
                className={cn('text-tiny text-foreground-400', {
                  'text-danger': fieldState.invalid,
                })}
              >
                {fieldState.error?.message ?? description}
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
};
