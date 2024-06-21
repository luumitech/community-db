import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import React from 'react';
import { graphql, useFragment } from '~/graphql/generated';
import { PropertyEntry } from '../_type';
import { RegisteredEventList } from './registered-event-list';

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
  fragment: PropertyEntry;
}

export const MembershipDisplay: React.FC<Props> = ({ className, fragment }) => {
  const entry = useFragment(MembershipDisplayFragment, fragment);
  const currentYear = new Date().getFullYear();

  const membership = React.useMemo(() => {
    const { membershipList } = entry;
    return membershipList.find(({ year }) => currentYear === year);
  }, [entry, currentYear]);

  return (
    <div className={className}>
      <Card>
        <CardHeader>{currentYear} Membership Info</CardHeader>
        <CardBody>
          <RegisteredEventList membership={membership} />
          <Divider className="my-2" />
          <p className="font-light">Notes:</p>
          <span className="whitespace-pre-wrap text-sm">{entry.notes}</span>
        </CardBody>
      </Card>
    </div>
  );
};
