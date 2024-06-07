import { Tooltip } from '@nextui-org/react';
import React from 'react';
import { IoCheckmark } from 'react-icons/io5';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';

const EntryFragment = graphql(/* GraphQL */ `
  fragment PropertyList_Membership on Property {
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
        eventDate
      }
    }
  }
`);

export type MemberShipFragmentType = FragmentType<typeof EntryFragment>;

interface Props {
  className?: string;
  entry: MemberShipFragmentType;
  year: number;
}

export const Membership: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);
  const membership = entry.membershipList.find(
    ({ year }) => year === props.year
  );
  const firstEvent = membership?.eventAttendedList[0];
  const eventInfo = firstEvent
    ? `Registered @ ${firstEvent.eventName} on ${firstEvent.eventDate}`
    : '';

  return (
    <div className={props.className}>
      {!!membership?.isMember && (
        <Tooltip content={eventInfo}>
          <span className="text-xl">
            <IoCheckmark />
          </span>
        </Tooltip>
      )}
    </div>
  );
};
