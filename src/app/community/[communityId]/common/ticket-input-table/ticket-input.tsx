import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { FlatButton } from '~/view/base/flat-button';
import { Input, InputProps } from '~/view/base/input';

type CustomInputProps = Omit<InputProps, 'controlName'>;

interface Props extends CustomInputProps {
  className?: string;
  controlNamePrefix: string;
}

export const TicketInput: React.FC<Props> = ({
  className,
  controlNamePrefix,
  ...prop
}) => {
  const { ticketDefault } = useAppContext();
  const { setValue, watch, clearErrors } = useFormContext();
  const ticketType = watch(`${controlNamePrefix}.ticketName`);
  const countDefault = React.useMemo(() => {
    const value = ticketDefault.get(ticketType);
    return value?.count;
  }, [ticketType, ticketDefault]);

  const onChange: NonNullable<InputProps['onChange']> = React.useCallback(
    (evt) => {
      /**
       * This is needed because price's validation error is triggered based on
       * count
       */
      clearErrors(`${controlNamePrefix}.price`);
    },
    [clearErrors, controlNamePrefix]
  );

  return (
    <Input
      className={clsx(className, 'min-w-12')}
      controlName={`${controlNamePrefix}.count`}
      aria-label="Ticket #"
      variant="underlined"
      type="number"
      endContent={
        countDefault != null && (
          <FlatButton
            icon="ticket"
            tooltip={`Use ticket default (${countDefault})`}
            onClick={() => {
              setValue(`${controlNamePrefix}.count`, countDefault);
            }}
          />
        )
      }
      onChange={onChange}
      {...prop}
    />
  );
};
