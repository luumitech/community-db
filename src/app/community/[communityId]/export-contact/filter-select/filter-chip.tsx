import { Chip } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { Icon } from '~/view/base/icon';
import { type InputData } from './use-hook-form';

interface Props {
  className?: string;
  filterArgs: InputData;
  openDrawer: () => void;
  onFilterChange?: (input: InputData) => Promise<void>;
  isDisabled?: boolean;
}

export const FilterChip: React.FC<Props> = ({
  className,
  filterArgs,
  openDrawer,
  onFilterChange,
  isDisabled,
}) => {
  const { filter } = filterArgs;
  const { memberYear, nonMemberYear, memberEvent } = filter;

  return (
    <div className="flex flex-wrap gap-2 cursor-pointer" onClick={openDrawer}>
      {!!memberYear && (
        <Chip
          variant="bordered"
          color="success"
          isDisabled={isDisabled}
          onClose={() =>
            onFilterChange?.({
              ...filterArgs,
              filter: { ...filter, memberYear: null },
            })
          }
        >
          <div className="flex items-center gap-2">
            {memberYear}
            <Icon icon="thumb-up" size={16} />
          </div>
        </Chip>
      )}
      {!!nonMemberYear && (
        <Chip
          variant="bordered"
          isDisabled={isDisabled}
          onClose={() =>
            onFilterChange?.({
              ...filterArgs,
              filter: { ...filter, nonMemberYear: null },
            })
          }
        >
          <div className="flex items-center gap-2">
            {nonMemberYear}
            <Icon icon="thumb-down" size={16} />
          </div>
        </Chip>
      )}
      {!!memberEvent && (
        <EventChip
          eventName={memberEvent}
          variant="faded"
          isDisabled={isDisabled}
          onClose={() =>
            onFilterChange?.({
              ...filterArgs,
              filter: { ...filter, memberEvent: null },
            })
          }
        />
      )}
    </div>
  );
};
