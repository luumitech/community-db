import { Chip, cn } from '@heroui/react';
import React from 'react';
import { ReactMultiEmail, type IReactMultiEmailProps } from 'react-multi-email';

type CustomReactMultiEmailProps = Omit<IReactMultiEmailProps, 'getLabel'>;

export interface PlainInputEmailProps extends CustomReactMultiEmailProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  isInvalid?: boolean;
  errorMessage?: React.ReactNode;
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

export const PlainInputEmail: React.FC<PlainInputEmailProps> = ({
  className,
  label,
  description,
  isInvalid,
  errorMessage,
  ...props
}) => {
  return (
    <div className={className}>
      <div
        className={cn(
          'border-2 border-default-200 hover:border-default-400',
          'focus-within:border-default-foreground',
          'rounded-xl px-3 py-2',
          { 'border-danger': isInvalid }
        )}
      >
        {label && (
          <label
            className={cn(
              'pointer-events-none z-10 cursor-text text-foreground/70',
              'max-w-full truncate pe-2 pb-0.5 text-xs',
              { 'text-danger': isInvalid }
            )}
          >
            {label}
          </label>
        )}
        <ReactMultiEmail
          className="flex flex-wrap items-center gap-2"
          inputClassName={cn(
            'bg-clip-text text-sm font-normal placeholder:text-foreground/60',
            'focus-visible:outline-hidden',
            'grow'
          )}
          getLabel={getLabel}
          {...props}
        />
      </div>
      {(!!description || !!errorMessage) && (
        <div className="flex-col gap-1.5 p-1">
          <div
            className={cn('text-xs text-foreground/50', {
              'text-danger': isInvalid,
            })}
          >
            {errorMessage ?? description}
          </div>
        </div>
      )}
    </div>
  );
};
