import React from 'react';
import { CurrencyInput, CurrencyInputProps } from '~/view/base/currency-input';
import { useHookFormContext } from '../use-hook-form';

type CustomCurrencyInputProps = Omit<CurrencyInputProps, 'controlName'>;

interface Props extends CustomCurrencyInputProps {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
}

export const PriceInput: React.FC<Props> = ({
  className,
  membershipPrefix,
  ...props
}) => {
  const { clearErrors } = useHookFormContext();

  const onChange: NonNullable<CurrencyInputProps['onChange']> =
    React.useCallback(
      (evt) => {
        /**
         * This is needed because paymentMethod's validation error is triggered
         * based on value of price
         */
        clearErrors(`${membershipPrefix}.paymentMethod`);
        clearErrors(`${membershipPrefix}.price`);
      },
      [clearErrors, membershipPrefix]
    );

  return (
    <CurrencyInput
      className={className}
      controlName={`${membershipPrefix}.price`}
      label="Price"
      allowNegative={false}
      onChange={onChange}
      {...props}
    />
  );
};
