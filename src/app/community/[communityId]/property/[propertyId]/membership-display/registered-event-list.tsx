import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
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
    <div className={clsx(className, 'text-sm flex gap-2 items-center')}>
      <span className="text-foreground-500 text-xs">Past event(s):</span>
      {eventAttendedList?.length === 0 && (
        <span className="text-foreground-500">n/a</span>
      )}
      {eventAttendedList?.map((entry) => (
        <Chip key={entry.eventName} variant="faded" radius="sm">
          {entry.eventName}
        </Chip>
      ))}
    </div>
  );
};
