import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFormContext } from '~/custom-hooks/hook-form';
import { calcPrice } from '~/lib/decimal-util';
import { CurrencyInput, CurrencyInputProps } from '~/view/base/currency-input';
import { FlatButton } from '~/view/base/flat-button';

type CustomCurrencyInputProps = Omit<CurrencyInputProps, 'controlName'>;

interface Props extends CustomCurrencyInputProps {
  className?: string;
  controlNamePrefix: string;
}

export const PriceInput: React.FC<Props> = ({
  className,
  controlNamePrefix,
  ...props
}) => {
  const { ticketDefault } = useAppContext();
  const { setValue, watch, clearErrors } = useFormContext();
  const ticketType = watch(`${controlNamePrefix}.ticketName`);
  const ticketCount = watch(`${controlNamePrefix}.count`);

  const ticketDef = ticketDefault.get(ticketType);
  const unitPrice = ticketDef?.unitPrice;
  const defaultPrice = calcPrice(unitPrice, ticketCount);

  const onChange: NonNullable<CurrencyInputProps['onChange']> =
    React.useCallback(
      (evt) => {
        /**
         * This is needed because paymentMethod's validation error is triggered
         * based on value of price
         */
        clearErrors(`${controlNamePrefix}.paymentMethod`);
      },
      [clearErrors, controlNamePrefix]
    );

  return (
    <CurrencyInput
      className={clsx(className)}
      controlName={`${controlNamePrefix}.price`}
      aria-label="Price"
      allowNegative={false}
      variant="underlined"
      endContent={
        defaultPrice != null && (
          <FlatButton
            icon="calculator"
            tooltip={`${ticketCount} * $${unitPrice} = $${defaultPrice}`}
            onClick={() => {
              setValue(`${controlNamePrefix}.price`, defaultPrice);
            }}
          />
        )
      }
      onChange={onChange}
      {...props}
    />
  );
};
