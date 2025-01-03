import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
}

export const FilterChip: React.FC<Props> = ({ className }) => {
  const {
    memberYear,
    nonMemberYear,
    event,
    filterSpecified,
    drawerDisclosure,
  } = useFilterBarContext();
  const { onOpen } = drawerDisclosure;

  const [selectedMemberYear] = memberYear;
  const [selectedNonMemberYear] = nonMemberYear;
  const [selectedEvent] = event;

  if (!filterSpecified) {
    return null;
  }

  return (
    <div className="flex gap-2 cursor-pointer" onClick={onOpen}>
      {!!selectedMemberYear && (
        <Chip
          variant="bordered"
          color="success"
          onClose={() => memberYear.clear()}
        >
          <div className="flex items-center gap-2">
            {selectedMemberYear}
            <Icon icon="thumb-up" size={16} />
          </div>
        </Chip>
      )}
      {!!selectedNonMemberYear && (
        <Chip variant="bordered" onClose={() => nonMemberYear.clear()}>
          <div className="flex items-center gap-2">
            {selectedNonMemberYear}
            <Icon icon="thumb-down" size={16} />
          </div>
        </Chip>
      )}
      {!!selectedEvent && (
        <EventChip eventName={selectedEvent} onClose={() => event.clear()} />
      )}
    </div>
  );
};
