import React from 'react';
import { DatePicker } from '~/view/base/date-picker';

interface Props {
  className?: string;
  yearIdx: number;
  eventIdx: number;
}

export const EventDatePicker: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
}) => {
  return (
    <DatePicker
      className={className}
      controlName={`membershipList.${yearIdx}.eventAttendedList.${eventIdx}.eventDate`}
      aria-label="Event Date"
      variant="underlined"
      granularity="day"
    />
  );
};
