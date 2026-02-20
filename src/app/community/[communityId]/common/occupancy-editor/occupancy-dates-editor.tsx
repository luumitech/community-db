import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { DatePicker } from '~/view/base/date-picker';

interface Props {
  className?: string;
  /**
   * Control name occupancy start date
   *
   * I.e. pastOccupantList.${number}.startDate
   */
  startDateControlName: string;
  /**
   * Control name occupancy start date
   *
   * I.e. pastOccupantList.${number}.endDate
   */
  endDateControlName?: string;
}

export const OccupancyDatesEditor: React.FC<Props> = ({
  className,
  startDateControlName,
  endDateControlName,
}) => {
  return (
    <div className={cn(className)}>
      {startDateControlName && (
        <DatePicker
          className={twMerge('max-w-xs', className)}
          controlName={startDateControlName}
          aria-label="Move In Date"
          label="Move In Date"
          granularity="day"
        />
      )}
      {endDateControlName && (
        <DatePicker
          className={twMerge('max-w-xs', className)}
          controlName={endDateControlName}
          aria-label="Move Out Date"
          label="Move Out Date"
          granularity="day"
        />
      )}
    </div>
  );
};
