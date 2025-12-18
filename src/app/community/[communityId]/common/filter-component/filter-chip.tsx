import { Chip, cn } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { WithGpsChip } from '~/community/[communityId]/common/with-gps-chip';
import { type RootState } from '~/lib/reducers';
import { Icon } from '~/view/base/icon';

type FilterItems = Pick<
  RootState['searchBar'],
  'memberYearList' | 'nonMemberYearList' | 'memberEventList' | 'withGps'
>;
type FilterChangeFn = (input: FilterItems) => Promise<void>;

interface Props {
  className?: string;
  openDrawer: () => void;
  filters: FilterItems;
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

  const onChange = React.useCallback(
    (_filters: FilterItems) => {
      onFilterChange?.(_filters);
    },
    [onFilterChange]
  );

  return (
    <div
      className={cn(className, 'hidden cursor-pointer gap-2 sm:flex')}
      onClick={openDrawer}
    >
      {memberYearList != null && memberYearList.length > 0 && (
        <Chip
          variant="bordered"
          color="success"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, memberYearList: [] })}
        >
          <div className="flex items-center gap-2">
            {memberYearList.join(',')}
            <Icon icon="thumb-up" size={16} />
          </div>
        </Chip>
      )}
      {nonMemberYearList != null && nonMemberYearList.length > 0 && (
        <Chip
          variant="bordered"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, nonMemberYearList: [] })}
        >
          <div className="flex items-center gap-2">
            {nonMemberYearList.join(',')}
            <Icon icon="thumb-down" size={16} />
          </div>
        </Chip>
      )}
      {memberEventList != null && memberEventList.length > 0 && (
        <EventChip
          eventName={memberEventList.join(',')}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() => onChange({ ...filters, memberEventList: [] })}
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
