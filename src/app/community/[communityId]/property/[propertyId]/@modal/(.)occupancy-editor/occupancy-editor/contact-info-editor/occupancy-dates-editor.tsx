import { cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { createDatePicker } from '~/view/base/date-picker';
import { type InputData } from '../../use-hook-form';

const DatePicker = createDatePicker<InputData>();

interface Props {
  className?: string;
  /** OccupancyList hook-form control name prefix */
  controlNamePrefix: `occupancyInfoList.${number}`;
}

export const OccupancyDatesEditor: React.FC<Props> = ({
  className,
  controlNamePrefix,
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <DatePicker
        className={twMerge('max-w-xs', className)}
        controlName={`${controlNamePrefix}.moveInDate`}
        aria-label="Move In Date"
        label="Move In Date"
        granularity="day"
        showMonthAndYearPickers
      />
      <DatePicker
        className={twMerge('max-w-xs', className)}
        controlName={`${controlNamePrefix}.moveOutDate`}
        aria-label="Move Out Date"
        label="Move Out Date"
        granularity="day"
        showMonthAndYearPickers
      />
    </div>
  );
};
