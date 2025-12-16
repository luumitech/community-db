import React from 'react';
import { twMerge } from 'tailwind-merge';
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
    <div className={twMerge('flex flex-col gap-4', className)}>
      <p>
        Use filters to select a property group for changes. If no filter is
        selected, changes apply to all properties:
      </p>
      <YearSelect
        className="ml-4 max-w-xs min-w-32"
        controlName="filter.memberYearList"
        label="Membership Year(s)"
        isRequired={yearRequired}
        size="sm"
      />
      <EventSelect
        className="ml-4 max-w-xs min-w-32"
        controlName="filter.memberEvent"
        size="sm"
      />
      {withGps && (
        <GpsSelect
          className="ml-4 max-w-xs min-w-32"
          controlName="filter.withGps"
          size="sm"
        />
      )}
    </div>
  );
};
