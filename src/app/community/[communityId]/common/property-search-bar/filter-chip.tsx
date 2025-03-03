import { Chip } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  openDrawer: () => void;
}

export const FilterChip: React.FC<Props> = ({ className, openDrawer }) => {
  const { isFilterSpecified, memberYear, nonMemberYear, event } =
    useFilterBarContext();

  if (!isFilterSpecified) {
    return null;
  }

  const [memberYearStr] = memberYear;
  const [nonMemberYearStr] = nonMemberYear;
  const [eventStr] = event;

  return (
    <div className="flex gap-2 cursor-pointer" onClick={openDrawer}>
      {!!memberYearStr && (
        <Chip
          variant="bordered"
          color="success"
          onClose={() => memberYear.clear()}
        >
          <div className="flex items-center gap-2">
            {memberYearStr}
            <Icon icon="thumb-up" size={16} />
          </div>
        </Chip>
      )}
      {!!nonMemberYearStr && (
        <Chip variant="bordered" onClose={() => nonMemberYear.clear()}>
          <div className="flex items-center gap-2">
            {nonMemberYearStr}
            <Icon icon="thumb-down" size={16} />
          </div>
        </Chip>
      )}
      {!!eventStr && (
        <EventChip
          eventName={eventStr}
          variant="faded"
          onClose={() => event.clear()}
        />
      )}
    </div>
  );
};
