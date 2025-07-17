import { Chip, cn } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { WithGpsChip } from '~/community/[communityId]/common/with-gps-chip';
import { useSelector } from '~/custom-hooks/redux';
import { Icon } from '~/view/base/icon';
import { defaultInputData, type InputData } from './use-hook-form';

interface Props {
  className?: string;
  openDrawer: () => void;
  onFilterChange?: (input: InputData) => Promise<void>;
}

export const FilterChip: React.FC<Props> = ({
  className,
  openDrawer,
  onFilterChange,
}) => {
  const searchBar = useSelector((state) => state.searchBar);

  if (!searchBar.isFilterSpecified) {
    return null;
  }

  const { memberYear, nonMemberYear, event, withGps } = searchBar;
  const state = defaultInputData(memberYear, nonMemberYear, event, withGps);

  return (
    <div
      className={cn(className, 'hidden sm:flex gap-2 cursor-pointer')}
      onClick={openDrawer}
    >
      {memberYear != null && (
        <Chip
          variant="bordered"
          color="success"
          onClose={() => onFilterChange?.({ ...state, memberYear: null })}
        >
          <div className="flex items-center gap-2">
            {searchBar.memberYear}
            <Icon icon="thumb-up" size={16} />
          </div>
        </Chip>
      )}
      {nonMemberYear != null && (
        <Chip
          variant="bordered"
          onClose={() => onFilterChange?.({ ...state, nonMemberYear: null })}
        >
          <div className="flex items-center gap-2">
            {nonMemberYear}
            <Icon icon="thumb-down" size={16} />
          </div>
        </Chip>
      )}
      {event != null && (
        <EventChip
          eventName={event}
          variant="faded"
          onClose={() => onFilterChange?.({ ...state, event: null })}
        />
      )}
      {withGps != null && (
        <WithGpsChip
          withGps={withGps}
          variant="faded"
          onClose={() => onFilterChange?.({ ...state, withGps: null })}
        />
      )}
    </div>
  );
};
