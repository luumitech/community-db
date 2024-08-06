import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
  membership?: GQL.PropertyId_MembershipDisplayFragment['membershipList'][0];
}

export const RegisteredEventList: React.FC<Props> = ({
  className,
  membership,
}) => {
  const { eventAttendedList, isMember } = membership ?? {};

  return (
    <div className={clsx(className)}>
      <div className="flex gap-2">
        <Chip
          variant="flat"
          radius="md"
          color={isMember ? 'success' : 'secondary'}
        >
          <div className="flex items-center gap-2">
            {isMember ? 'member' : 'non-member'}
            <Icon icon={isMember ? 'thumb-up' : 'thumb-down'} size={16} />
          </div>
        </Chip>
        {eventAttendedList?.map((entry) => (
          <Chip key={entry.eventName} variant="faded" radius="sm">
            {entry.eventName}
          </Chip>
        ))}
      </div>
    </div>
  );
};
