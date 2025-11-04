import React from 'react';
import { CurrencyInput, CurrencyInputProps } from '~/view/base/currency-input';

type CustomCurrencyInputProps = Omit<CurrencyInputProps, 'controlName'>;

interface Props extends CustomCurrencyInputProps {
  className?: string;
  controlNamePrefix: string;
}

export const MembershipPriceInput: React.FC<Props> = ({
  className,
  controlNamePrefix,
  ...props
}) => {
  return (
    <CurrencyInput
      className={className}
      controlName={`${controlNamePrefix}.price`}
      aria-label="Price"
      allowNegative={false}
      variant="underlined"
      {...props}
    />
  );
};
