import { Chip, cn } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { WithGpsChip } from '~/community/[communityId]/common/with-gps-chip';
import { Icon } from '~/view/base/icon';

interface FilterItems {
  memberYear?: number | null;
  nonMemberYear?: number | null;
  memberEvent?: string | null;
  withGps?: boolean | null;
}

interface Props {
  className?: string;
  openDrawer: () => void;
  filters: FilterItems;
  isDisabled?: boolean;
  onFilterChange?: (input: Required<FilterItems>) => Promise<void>;
}

export const FilterChip: React.FC<Props> = ({
  className,
  openDrawer,
  filters,
  isDisabled,
  onFilterChange,
}) => {
  const { memberYear, nonMemberYear, memberEvent, withGps } = filters;

  const onChange = React.useCallback(
    (_filters: FilterItems) => {
      onFilterChange?.({
        memberYear: _filters.memberYear ?? null,
        nonMemberYear: _filters.nonMemberYear ?? null,
        memberEvent: _filters.memberEvent ?? null,
        withGps: _filters.withGps ?? null,
      });
    },
    [onFilterChange]
  );

  return (
    <div
      className={cn(className, 'hidden sm:flex gap-2 cursor-pointer')}
      onClick={openDrawer}
    >
      {memberYear != null && (
        <Chip
          variant="bordered"
          color="success"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, memberYear: null })}
        >
          <div className="flex items-center gap-2">
            {memberYear}
            <Icon icon="thumb-up" size={16} />
          </div>
        </Chip>
      )}
      {nonMemberYear != null && (
        <Chip
          variant="bordered"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, nonMemberYear: null })}
        >
          <div className="flex items-center gap-2">
            {nonMemberYear}
            <Icon icon="thumb-down" size={16} />
          </div>
        </Chip>
      )}
      {memberEvent != null && (
        <EventChip
          eventName={memberEvent}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, memberEvent: null })}
        />
      )}
      {withGps != null && (
        <WithGpsChip
          withGps={withGps}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, withGps: null })}
        />
      )}
    </div>
  );
};
