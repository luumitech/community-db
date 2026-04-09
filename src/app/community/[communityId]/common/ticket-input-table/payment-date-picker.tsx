import React from 'react';
import { createDatePicker } from '~/view/base/date-picker';

const DatePicker = createDatePicker();

interface Props {
  className?: string;
  controlNamePrefix: string;
}

export const PaymentDatePicker: React.FC<Props> = ({
  className,
  controlNamePrefix,
}) => {
  return (
    <DatePicker
      className={className}
      controlName={`${controlNamePrefix}.paymentDate`}
      aria-label="Payment Date"
      variant="underlined"
      granularity="day"
    />
  );
};
