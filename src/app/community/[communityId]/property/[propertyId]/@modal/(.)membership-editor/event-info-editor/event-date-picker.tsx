import React from 'react';
import { createDatePicker } from '~/view/base/date-picker';
import { type InputData } from '../use-hook-form';

const DatePicker = createDatePicker<InputData>();

interface Props {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
  eventPrefix: `membershipList.${number}.eventAttendedList.${number}`;
}

export const EventDatePicker: React.FC<Props> = ({
  className,
  eventPrefix,
}) => {
  return (
    <DatePicker
      className={className}
      controlName={`${eventPrefix}.eventDate`}
      aria-label="Event Date"
      variant="underlined"
      granularity="day"
    />
  );
};
