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
    <div className={clsx(className, 'flex gap-2')}>
      {eventAttendedList?.map((entry) => (
        <Chip key={entry.eventName} variant="faded" radius="sm">
          {entry.eventName}
        </Chip>
      ))}
    </div>
  );
};
