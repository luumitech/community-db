import clsx from 'clsx';
import React from 'react';
import { CurrencyInput } from '~/view/base/currency-input';

interface Props {
  className?: string;
  yearIdx: number;
  eventIdx?: number;
}

export const PriceInput: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
}) => {
  const controlName =
    eventIdx == null
      ? `membershipList.${yearIdx}.price`
      : `membershipList.${yearIdx}.eventAttendedList.${eventIdx}.price`;

  return (
    <CurrencyInput
      className={clsx(className)}
      controlName={controlName}
      aria-label="Price"
      allowNegative={false}
      variant="underlined"
    />
  );
};
