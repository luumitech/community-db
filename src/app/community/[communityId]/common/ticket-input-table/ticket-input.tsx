import { cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { Decimal, decMul } from '~/lib/decimal-util';
import { FlatButton } from '~/view/base/flat-button';
import { NumberInput, NumberInputProps } from '~/view/base/number-input';

type TicketInputProps = Omit<NumberInputProps, 'controlName'>;

interface Props extends TicketInputProps {
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

  return (
    <NumberInput
      classNames={{
        base: cn(className, 'min-w-16'),
        // This will align input and select items text on the same line
        innerWrapper: cn('pb-0'),
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
      onValueChange={updatePrice}
      hideStepper
      isWheelDisabled
      {...props}
    />
  );
};
