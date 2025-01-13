import clsx from 'clsx';
import { Decimal } from 'decimal.js';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { CurrencyInput, CurrencyInputProps } from '~/view/base/currency-input';
import { FlatButton } from '~/view/base/flat-button';
import { useHookFormContext } from '../use-hook-form';

type CustomCurrencyInputProps = Omit<CurrencyInputProps, 'controlName'>;

interface Props extends CustomCurrencyInputProps {
  className?: string;
  yearIdx: number;
  eventIdx: number;
  ticketIdx: number;
}

export const PriceInput: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
  ticketIdx,
  ...props
}) => {
  const ticketControlPrefix =
    `membershipList.${yearIdx}.eventAttendedList.${eventIdx}.ticketList.${ticketIdx}` as const;
  const { ticketDefault } = useAppContext();
  const { setValue, watch } = useHookFormContext();
  const ticketType = watch(`${ticketControlPrefix}.ticketName`);
  const ticketCount = watch(`${ticketControlPrefix}.count`);
  const unitPrice = React.useMemo(() => {
    const value = ticketDefault.get(ticketType);
    return value?.unitPrice;
  }, [ticketType, ticketDefault]);
  const defaultPrice = React.useMemo(() => {
    if (unitPrice == null || ticketCount == null) {
      return null;
    }
    const unitPriceDec = new Decimal(unitPrice);
    const defaultPriceDec = unitPriceDec.mul(new Decimal(ticketCount));
    return defaultPriceDec.toString();
  }, [unitPrice, ticketCount]);

  return (
    <CurrencyInput
      className={clsx(className)}
      controlName={`${ticketControlPrefix}.price`}
      aria-label="Price"
      allowNegative={false}
      variant="underlined"
      endContent={
        unitPrice != null &&
        ticketCount != null && (
          <FlatButton
            icon="calculator"
            tooltip={`${ticketCount} * $${unitPrice} = $${defaultPrice}`}
            onClick={() => {
              setValue(`${ticketControlPrefix}.price`, defaultPrice);
            }}
          />
        )
      }
      {...props}
    />
  );
};
