import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { FlatButton } from '~/view/base/flat-button';
import { Input, InputProps } from '~/view/base/input';
import { useHookFormContext } from '../use-hook-form';

type CustomInputProps = Omit<InputProps, 'controlName'>;

interface Props extends CustomInputProps {
  className?: string;
  ticketIdx: number;
}

export const TicketInput: React.FC<Props> = ({
  className,
  ticketIdx,
  ...prop
}) => {
  const ticketControlPrefix = `event.ticketList.${ticketIdx}` as const;
  const { ticketDefault } = useAppContext();
  const { setValue, watch } = useHookFormContext();
  const ticketType = watch(`${ticketControlPrefix}.ticketName`);
  const countDefault = React.useMemo(() => {
    const value = ticketDefault.get(ticketType);
    return value?.count;
  }, [ticketType, ticketDefault]);

  return (
    <Input
      className={clsx(className)}
      controlName={`${ticketControlPrefix}.count`}
      aria-label="Ticket #"
      variant="underlined"
      type="number"
      min={0}
      endContent={
        countDefault != null && (
          <FlatButton
            icon="ticket"
            tooltip={`Use ticket default (${countDefault})`}
            onClick={() => {
              setValue(`${ticketControlPrefix}.count`, countDefault, {
                shouldDirty: true,
              });
            }}
          />
        )
      }
      {...prop}
    />
  );
};
