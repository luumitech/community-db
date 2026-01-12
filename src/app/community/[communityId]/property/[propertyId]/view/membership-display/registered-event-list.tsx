import React from 'react';
import { twMerge } from 'tailwind-merge';
import { EventChip } from '~/community/[communityId]/common/chip/event-chip';
import * as GQL from '~/graphql/generated/graphql';

interface Props {
  className?: string;
  membership?: GQL.PropertyId_MembershipDisplayFragment['membershipList'][number];
}

export const RegisteredEventList: React.FC<Props> = ({
  className,
  membership,
}) => {
  const { eventAttendedList } = membership ?? {};

  return (
    <div className={twMerge('flex items-center gap-2 text-sm', className)}>
      <span className="text-xs text-foreground-500">Past event(s):</span>
      {eventAttendedList?.length === 0 && (
        <span className="text-foreground-500">n/a</span>
      )}
      <div className="flex flex-wrap gap-2">
        {eventAttendedList?.map((entry) => (
          <EventChip key={entry.eventName} eventName={entry.eventName} />
        ))}
      </div>
    </div>
  );
};
