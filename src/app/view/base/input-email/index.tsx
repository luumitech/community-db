import { Chip, cn } from '@heroui/react';
import React from 'react';
import { ReactMultiEmail, type IReactMultiEmailProps } from 'react-multi-email';
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from '~/custom-hooks/hook-form';

export { SelectItem, SelectSection } from '@heroui/react';

type CustomReactMultiEmailProps = Omit<IReactMultiEmailProps, 'getLabel'>;

export interface InputEmailProps<
  P extends FieldValues = FieldValues,
> extends CustomReactMultiEmailProps {
  controlName: Path<P>;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const getLabel: IReactMultiEmailProps['getLabel'] = (
  email,
  index,
  removeEmail
) => {
  return (
    <Chip key={index} size="sm" onClose={() => removeEmail(index)}>
      {email}
    </Chip>
  );
};

/** ReactMultiEmail is only available in controlled form */
export function InputEmail<P extends FieldValues = FieldValues>({
  className,
  controlName,
  label,
  onBlur,
  onChange,
  description,
  ...props
}: InputEmailProps<P>) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={controlName}
      render={({ field, fieldState }) => (
        <div className={className}>
          <div
            className={cn(
              'border-2 border-default-200 hover:border-default-400',
              'focus-within:border-default-foreground',
              'rounded-xl px-3 py-2',
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
                'bg-clip-text text-sm font-normal placeholder:text-foreground-500',
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
                className={cn('text-xs text-foreground-400', {
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
}

/**
 * A component factory that takes the FieldValues as generic to produce a
 * component that would provide type assistance to controlName property
 */
export function createInputEmail<P extends FieldValues>() {
  type Props = InputEmailProps<P>;

  const component = InputEmail as (props: Props) => React.ReactElement;
  return component;
}
