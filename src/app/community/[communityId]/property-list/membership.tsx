import { Tooltip } from '@heroui/react';
import React from 'react';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import { Icon } from '~/view/base/icon';

const MembershipFragment = graphql(/* GraphQL */ `
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
type MembershipFragmentType = FragmentType<typeof MembershipFragment>;

interface Props {
  className?: string;
  fragment: MembershipFragmentType;
  year: number;
}

export const Membership: React.FC<Props> = ({
  className,
  fragment,
  ...props
}) => {
  const entry = getFragment(MembershipFragment, fragment);
  const membership = entry.membershipList.find(
    ({ year }) => year === props.year
  );
  const firstEvent = membership?.eventAttendedList[0];
  const eventInfo = firstEvent
    ? `Registered @ ${firstEvent.eventName} on ${firstEvent.eventDate}`
    : '';

  return (
    <div className={className}>
      {!!membership?.isMember && (
        // <Tooltip content={eventInfo}>
        <span className="text-xl">
          <Icon icon="checkmark" />
        </span>
        // </Tooltip>
      )}
    </div>
  );
};
