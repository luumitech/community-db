import React from 'react';
import { createDatePicker } from '~/view/base/date-picker';
import { type InputData } from '../use-hook-form';

const DatePicker = createDatePicker<InputData>();

interface Props {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
}

export const PaymentDatePicker: React.FC<Props> = ({
  className,
  membershipPrefix,
}) => {
  return (
    <DatePicker
      className={className}
      controlName={`${membershipPrefix}.paymentDate`}
      label="Payment Date"
      granularity="day"
    />
  );
};
