import React from 'react';
import { createDatePicker } from '~/view/base/date-picker';
import { type InputData } from '../use-hook-form';

const DatePicker = createDatePicker<InputData>();

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
