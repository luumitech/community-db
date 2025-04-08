import { Chip } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  openDrawer: () => void;
}

export const FilterChip: React.FC<Props> = ({ className, openDrawer }) => {
  const dispatch = useDispatch();
  const { isFilterSpecified, memberYear, nonMemberYear, event } = useSelector(
    (state) => state.searchBar
  );

  if (!isFilterSpecified) {
    return null;
  }

  return (
    <div className="flex gap-2 cursor-pointer" onClick={openDrawer}>
      {!!memberYear && (
        <Chip
          variant="bordered"
          color="success"
          onClose={() => dispatch(actions.searchBar.setMemberYear())}
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
          onClose={() => dispatch(actions.searchBar.setNonMemberYear())}
        >
          <div className="flex items-center gap-2">
            {nonMemberYear}
            <Icon icon="thumb-down" size={16} />
          </div>
        </Chip>
      )}
      {!!event && (
        <EventChip
          eventName={event}
          variant="faded"
          onClose={() => dispatch(actions.searchBar.setEvent())}
        />
      )}
    </div>
  );
};
