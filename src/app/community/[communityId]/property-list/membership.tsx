import { Tooltip } from '@nextui-org/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { Icon } from '~/view/base/icon';
import { type PropertyEntry } from './_type';

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

interface Props {
  className?: string;
  fragment: PropertyEntry;
  year: number;
}

export const Membership: React.FC<Props> = ({
  className,
  fragment,
  ...props
}) => {
  const entry = getFragment(EntryFragment, fragment);
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
