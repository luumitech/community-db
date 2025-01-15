import clsx from 'clsx';
import React from 'react';
import { CurrencyInput, CurrencyInputProps } from '~/view/base/currency-input';

type CustomCurrencyInputProps = Omit<CurrencyInputProps, 'controlName'>;

interface Props extends CustomCurrencyInputProps {
  className?: string;
}

export const PriceInput: React.FC<Props> = ({ className, ...props }) => {
  return (
    <CurrencyInput
      className={clsx(className)}
      controlName="membership.price"
      aria-label="Price"
      allowNegative={false}
      variant="underlined"
      {...props}
    />
  );
};
