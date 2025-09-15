import { cn } from '@heroui/react';
import React from 'react';
import {
  EventSelect,
  GpsSelect,
  YearSelect,
} from '~/community/[communityId]/common/filter-component';

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
      <YearSelect
        className="ml-4 min-w-32 max-w-xs"
        controlName="filter.memberYear"
        label="Membership Year"
        isRequired={yearRequired}
        size="sm"
      />
      <EventSelect
        className="ml-4 min-w-32 max-w-xs"
        controlName="filter.memberEvent"
        size="sm"
      />
      {withGps && (
        <GpsSelect
          className="ml-4 min-w-32 max-w-xs"
          controlName="filter.withGps"
          size="sm"
        />
      )}
    </div>
  );
};
