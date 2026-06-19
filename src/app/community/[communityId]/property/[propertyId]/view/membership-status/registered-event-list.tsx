import React from 'react';
import { twMerge } from 'tailwind-merge';
import { EventChip } from '~/community/[communityId]/common/chip/event-chip';
import type { MembershipEntry } from './_type';

interface Props {
  className?: string;
  membership?: MembershipEntry;
}

export const RegisteredEventList: React.FC<Props> = ({
  className,
  membership,
}) => {
  const { eventAttendedList } = membership ?? {};

  return (
    <div className={twMerge('flex items-center gap-2 text-sm', className)}>
      <span className="text-xs text-foreground/60">Past event(s):</span>
      {eventAttendedList?.length === 0 && (
        <span className="text-foreground/60">n/a</span>
      )}
      <div className="flex flex-wrap gap-2">
        {eventAttendedList?.map((entry) => (
          <EventChip key={entry.eventName} eventName={entry.eventName} />
        ))}
      </div>
    </div>
  );
};
