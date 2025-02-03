import { Chip, cn, useDisclosure } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import { Icon } from '~/view/base/icon';
import {
  useHookFormContext,
  useIsFilterSpecified,
  type InputData,
} from './use-hook-form';

interface Props {
  className?: string;
  disclosure: ReturnType<typeof useDisclosure>;
  onChange?: (input: InputData) => void;
}

export const FilterChip: React.FC<Props> = ({
  className,
  disclosure,
  onChange,
}) => {
  const { filterSpecified, memberYear, nonMemberYear, event } =
    useIsFilterSpecified();
  const { setValue } = useHookFormContext();
  const { onOpen } = disclosure;

  if (!filterSpecified) {
    return null;
  }

  return (
    <div className="flex gap-2 cursor-pointer" onClick={onOpen}>
      {!!memberYear && (
        <Chip
          variant="bordered"
          color="success"
          onClose={() => {
            setValue('memberYear', '');
            onChange?.({ memberYear: '', nonMemberYear, event });
          }}
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
          onClose={() => {
            setValue('nonMemberYear', '');
            onChange?.({ memberYear, nonMemberYear: '', event });
          }}
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
          onClose={() => {
            setValue('event', '');
            onChange?.({ memberYear, nonMemberYear, event: '' });
          }}
        />
      )}
    </div>
  );
};
