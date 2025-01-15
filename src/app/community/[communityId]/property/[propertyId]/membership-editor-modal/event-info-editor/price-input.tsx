import clsx from 'clsx';
import React from 'react';
import { CurrencyInput, CurrencyInputProps } from '~/view/base/currency-input';

type CustomCurrencyInputProps = Omit<CurrencyInputProps, 'controlName'>;

interface Props extends CustomCurrencyInputProps {
  className?: string;
  yearIdx: number;
}

export const PriceInput: React.FC<Props> = ({
  className,
  yearIdx,
  ...props
}) => {
  return (
    <CurrencyInput
      className={clsx(className)}
      controlName={`membershipList.${yearIdx}.price`}
      aria-label="Price"
      allowNegative={false}
      variant="underlined"
      {...props}
    />
  );
};
