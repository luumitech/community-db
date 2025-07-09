import { cn } from '@heroui/react';
import React from 'react';
import { EventSelect } from './event-select';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
  yearRequired?: boolean;
}

export const FilterSelect: React.FC<Props> = ({ className, yearRequired }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-4')}>
      Select filters to apply changes to a subset of properties:
      <div className="ml-4 flex gap-2 items-center">
        <YearSelect isRequired={yearRequired} />
      </div>
      <div className="ml-4 flex gap-2 items-center">
        <EventSelect />
      </div>
    </div>
  );
};
