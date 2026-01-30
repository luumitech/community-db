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
              'rounded-medium px-3 py-2',
              { 'border-danger': fieldState.invalid }
            )}
          >
            {label && (
              <label
                className={cn(
                  'pointer-events-none z-10 cursor-text text-default-600',
                  'max-w-full truncate pe-2 pb-0.5 text-xs',
                  { 'text-danger': fieldState.invalid }
                )}
              >
                {label}
              </label>
            )}
            <ReactMultiEmail
              emails={field.value}
              className="flex flex-wrap items-center gap-2"
              inputClassName={cn(
                'bg-clip-text text-small font-normal placeholder:text-foreground-500',
                'focus-visible:outline-hidden',
                'grow'
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
            <div className="flex-col gap-1.5 p-1">
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
