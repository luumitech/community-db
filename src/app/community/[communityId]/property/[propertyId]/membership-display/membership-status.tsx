import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import * as GQL from '~/graphql/generated/graphql';
import { RegisteredEventList } from './registered-event-list';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
  property: GQL.PropertyId_MembershipDisplayFragment;
}

export const MembershipStatus: React.FC<Props> = ({ className, property }) => {
  const { communityUi, minYear, maxYear } = useAppContext();
  const { yearSelected } = communityUi;
  const { membershipList } = property;

  const membership = React.useMemo(() => {
    const matched = membershipList.find(
      ({ year }) => yearSelected === year.toString()
    );
    if (matched) {
      return matched;
    }
    // Return an empty membership entry, if it's not in database
    return {
      year: parseInt(yearSelected, 10),
    } as GQL.Membership;
  }, [membershipList, yearSelected]);

  return (
    <Card className={className}>
      <CardHeader>Membership Status</CardHeader>
      <CardBody>
        <YearSelect
          yearRange={[minYear, maxYear]}
          membershipList={property.membershipList}
          selectedYear={yearSelected}
          onYearChange={communityUi.actions.setYearSelected}
        />
      </CardBody>
      <CardFooter>
        <RegisteredEventList membership={membership} />
      </CardFooter>
    </Card>
  );
};
