import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { RegisteredEventList } from './registered-event-list';

const EntryFragment = graphql(/* GraphQL */ `
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
  entry: FragmentType<typeof EntryFragment>;
}

export const MembershipDisplay: React.FC<Props> = (props) => {
  const entry = useFragment(EntryFragment, props.entry);
  const currentYear = new Date().getFullYear();

  const membership = React.useMemo(() => {
    const { membershipList } = entry;
    return membershipList.find(({ year }) => currentYear === year);
  }, [entry, currentYear]);

  return (
    <div className={props.className}>
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
