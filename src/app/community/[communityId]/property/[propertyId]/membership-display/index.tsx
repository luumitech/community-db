import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { PropertyEntry } from '../_type';
import { MemberStatusChip } from './member-status-chip';
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
  const { communityUi } = useAppContext();
  const { yearSelected } = communityUi;
  const { membershipList } = entry;

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
    <div className={className}>
      <Card>
        <CardHeader className="gap-2">
          <YearSelect
            membershipList={entry.membershipList}
            selectedYear={yearSelected}
            onChange={(year) => communityUi.actions.setYearSelected(year)}
          >
            Membership Info For Year
          </YearSelect>
          <div className="grow" />
          <MemberStatusChip membership={membership} />
        </CardHeader>
        <CardBody>
          <RegisteredEventList membership={membership} />
          <Divider className="my-2" />
          <p className="font-light">Notes:</p>
          <ScrollShadow className="h-28">
            <span className="whitespace-pre-wrap text-sm">{entry.notes}</span>
          </ScrollShadow>
        </CardBody>
      </Card>
    </div>
  );
};
