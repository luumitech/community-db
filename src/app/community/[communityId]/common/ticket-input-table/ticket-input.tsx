import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { Decimal, decMul } from '~/lib/decimal-util';
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
  ...props
}) => {
  const { ticketDefault } = useAppContext();
  const { setValue, watch } = useFormContext();
  const ticketType = watch(`${controlNamePrefix}.ticketName`);

  const ticketDef = ticketDefault.get(ticketType);
  const countDefault = ticketDef?.count;
  const unitPrice = ticketDef?.unitPrice;

  const updatePrice = React.useCallback(
    (ticketCount: Decimal.Value) => {
      const price = decMul(unitPrice, ticketCount);
      setValue(`${controlNamePrefix}.price`, price, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [controlNamePrefix, setValue, unitPrice]
  );

  const onChange: NonNullable<InputProps['onChange']> = React.useCallback(
    (evt) => {
      const ticketCount = evt.currentTarget.value;
      updatePrice(ticketCount);
    },
    [updatePrice]
  );

  return (
    <Input
      classNames={{
        base: clsx(className, 'min-w-16'),
        // This will align input and select items text on the same line
        innerWrapper: clsx('pb-0'),
      }}
      controlName={`${controlNamePrefix}.count`}
      isControlled
      aria-label="Ticket #"
      variant="underlined"
      type="number"
      endContent={
        countDefault != null && (
          <FlatButton
            icon="ticket"
            tooltip={`Use ticket default (${countDefault})`}
            onClick={() => {
              setValue(`${controlNamePrefix}.count`, countDefault, {
                shouldDirty: true,
              });
              updatePrice(countDefault);
            }}
          />
        )
      }
      onChange={onChange}
      {...props}
    />
  );
};
