import { cn } from '@heroui/react';
import React from 'react';
import { EventChip } from '~/community/[communityId]/common/event-chip';
import * as GQL from '~/graphql/generated/graphql';

interface Props {
  className?: string;
  membership?: GQL.PropertyId_MembershipDisplayFragment['membershipList'][0];
}

export const RegisteredEventList: React.FC<Props> = ({
  className,
  membership,
}) => {
  const { eventAttendedList } = membership ?? {};

  return (
    <div className={cn(className, 'text-sm flex gap-2 items-center ')}>
      <span className="text-foreground-500 text-xs">Past event(s):</span>
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
