import { Chip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { MdOutlineThumbDown, MdOutlineThumbUp } from 'react-icons/md';
import * as GQL from '~/graphql/generated/graphql';

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
          endContent={
            isMember ? <MdOutlineThumbUp size={18} /> : <MdOutlineThumbDown />
          }
        >
          {isMember ? 'member' : 'non-member'}
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
