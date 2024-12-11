import clsx from 'clsx';
import React from 'react';
import { DatePicker } from '~/view/base/date-picker';

interface Props {
  className?: string;
}

export const EventDatePicker: React.FC<Props> = ({ className }) => {
  return (
    <DatePicker
      className={clsx(className)}
      controlName="event.eventDate"
      label="Event Date"
      granularity="day"
      isControlled
    />
  );
};
