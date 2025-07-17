import { cn } from '@heroui/react';
import React from 'react';
import { DatePicker } from '~/view/base/date-picker';

interface Props {
  className?: string;
}

export const EventDatePicker: React.FC<Props> = ({ className }) => {
  return (
    <DatePicker
      className={cn(className, 'max-w-xs')}
      controlName="membership.eventAttended.eventDate"
      aria-label="Event Date"
      variant="underlined"
      granularity="day"
    />
  );
};
