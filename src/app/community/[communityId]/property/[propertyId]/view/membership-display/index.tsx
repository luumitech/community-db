import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { getFragment, graphql } from '~/graphql/generated';
import { CurrentEvent } from './current-event';
import { MembershipStatus } from './membership-status';
import { NotesView } from './notes-view';

const MembershipDisplayFragment = graphql(/* GraphQL */ `
  fragment PropertyId_MembershipDisplay on Property {
    notes
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
      }
    }
  }
`);

interface Props {
  className?: string;
}

export const MembershipDisplay: React.FC<Props> = ({ className }) => {
  const { property } = useLayoutContext();
  const entry = getFragment(MembershipDisplayFragment, property);

  return (
    <div className={className}>
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <MembershipStatus property={entry} />
        <CurrentEvent />
        {/* Notes section always taks full row */}
        <NotesView className="col-span-full" notes={entry.notes} />
      </div>
    </div>
  );
};
