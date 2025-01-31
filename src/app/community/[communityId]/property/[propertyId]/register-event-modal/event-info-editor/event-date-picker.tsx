import clsx from 'clsx';
import React from 'react';
import { DatePicker } from '~/view/base/date-picker';

interface Props {
  className?: string;
}

export const EventDatePicker: React.FC<Props> = ({ className }) => {
  return (
    <DatePicker
      className={clsx(className, 'max-w-xs')}
      controlName="event.eventDate"
      aria-label="Event Date"
      variant="underlined"
      granularity="day"
    />
  );
};
