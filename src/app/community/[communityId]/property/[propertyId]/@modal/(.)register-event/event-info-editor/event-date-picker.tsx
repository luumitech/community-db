import React from 'react';
import { twMerge } from 'tailwind-merge';
import { createDatePicker } from '~/view/base/date-picker';
import { type InputData } from '../use-hook-form';

const DatePicker = createDatePicker<InputData>();

interface Props {
  className?: string;
}

export const EventDatePicker: React.FC<Props> = ({ className }) => {
  return (
    <DatePicker
      className={twMerge('max-w-xs', className)}
      controlName="event.eventDate"
      aria-label="Event Date"
      variant="underlined"
      granularity="day"
    />
  );
};
