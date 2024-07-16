import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { insertIf } from '~/lib/insert-if';
import { PropertyEntry } from '../_type';
import { RegisteredEventList } from './registered-event-list';
import { YearSelect } from './year-select';

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
  const entry = getFragment(MembershipDisplayFragment, fragment);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState(
    currentYear.toString()
  );

  // If currentYear is not in the list of membership, add it
  const membershipList = React.useMemo(() => {
    const currentYearMembership = entry.membershipList.find(
      ({ year }) => currentYear === year
    );
    return [
      ...insertIf(!currentYearMembership, {
        year: currentYear,
      } as GQL.Membership),
      ...entry.membershipList,
    ];
  }, [entry, currentYear]);

  const membership = React.useMemo(() => {
    return membershipList.find(({ year }) => selectedYear === year.toString());
  }, [membershipList, selectedYear]);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <YearSelect
            membershipList={membershipList}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          >
            Membership Info
          </YearSelect>
        </CardHeader>
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
