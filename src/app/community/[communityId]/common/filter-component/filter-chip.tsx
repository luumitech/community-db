import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import {
  EventChip,
  WithGpsChip,
  YearChip,
} from '~/community/[communityId]/common/chip';
import { initialState, type FilterT } from '~/lib/reducers/search-bar';

type FilterChangeFn = (input: FilterT) => Promise<void>;

interface Props {
  className?: string;
  openDrawer: () => void;
  filters: FilterT;
  isDisabled?: boolean;
  onFilterChange?: FilterChangeFn;
}

export const FilterChip: React.FC<Props> = ({
  className,
  openDrawer,
  filters,
  isDisabled,
  onFilterChange,
}) => {
  const { memberYearList, nonMemberYearList, memberEventList, withGps } =
    filters;

  const removeMemberYear = React.useCallback(
    (year: number) => {
      const memberYearSet = new Set(filters.memberYearList);
      memberYearSet.delete(year);
      onFilterChange?.({
        ...filters,
        memberYearList: [...memberYearSet],
      });
    },
    [filters, onFilterChange]
  );

  const removeNonMemberYear = React.useCallback(
    (year: number) => {
      const nonMemberYearSet = new Set(filters.nonMemberYearList);
      nonMemberYearSet.delete(year);
      onFilterChange?.({
        ...filters,
        nonMemberYearList: [...nonMemberYearSet],
      });
    },
    [filters, onFilterChange]
  );

  const removeEvent = React.useCallback(
    (eventName: string) => {
      const eventSet = new Set(filters.memberEventList);
      eventSet.delete(eventName);
      onFilterChange?.({
        ...filters,
        memberEventList: [...eventSet],
      });
    },
    [filters, onFilterChange]
  );

  return (
    <div
      className={twMerge(
        'hidden items-center gap-2 sm:flex',
        'cursor-pointer',
        className
      )}
      onClick={openDrawer}
    >
      {!R.isDeepEqual(memberYearList, initialState.filter.memberYearList) &&
        memberYearList.map((year) => (
          <YearChip
            key={year}
            isMember
            showIcon
            year={year.toString()}
            isDisabled={isDisabled}
            onClose={() => removeMemberYear(year)}
          />
        ))}

      {!R.isDeepEqual(
        nonMemberYearList,
        initialState.filter.nonMemberYearList
      ) &&
        nonMemberYearList.map((year) => (
          <YearChip
            key={year}
            isMember={false}
            showIcon
            year={year.toString()}
            isDisabled={isDisabled}
            onClose={() => removeNonMemberYear(year)}
          />
        ))}

      {!R.isDeepEqual(memberEventList, initialState.filter.memberEventList) &&
        memberEventList.map((eventName) => (
          <EventChip
            key={eventName}
            eventName={eventName}
            isDisabled={isDisabled}
            onClose={() => removeEvent(eventName)}
          />
        ))}

      {withGps != null && (
        <WithGpsChip
          withGps={withGps}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() =>
            onFilterChange?.({
              ...filters,
              withGps: initialState.filter.withGps,
            })
          }
        />
      )}
    </div>
  );
};
