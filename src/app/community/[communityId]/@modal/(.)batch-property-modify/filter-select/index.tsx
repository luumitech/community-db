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
      <p>Find tune filters to select a group of properties to modify:</p>
      <YearSelect
        className="ml-4 max-w-xs min-w-32"
        controlName="filter.memberYearList"
        label="Membership Year(s)"
        isMember
        isRequired={yearRequired}
        size="sm"
        autoFocus
        isClearable
      />
      <EventSelect
        className="ml-4 max-w-xs min-w-32"
        controlName="filter.memberEventList"
        size="sm"
        isClearable
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
