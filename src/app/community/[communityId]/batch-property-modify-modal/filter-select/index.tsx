import { cn } from '@heroui/react';
import React from 'react';
import { EventSelect } from './event-select';
import { GpsSelect } from './gps-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
  yearRequired?: boolean;
  withGps?: boolean;
}

export const FilterSelect: React.FC<Props> = ({
  className,
  yearRequired,
  withGps,
}) => {
  return (
    <div className={cn(className, 'flex flex-col gap-4')}>
      <p>
        Use filters to select a property group for changes. If no filter is
        selected, changes apply to all properties:
      </p>
      <YearSelect className="ml-4" isRequired={yearRequired} />
      <EventSelect className="ml-4" />
      {withGps && <GpsSelect className="ml-4" />}
    </div>
  );
};
