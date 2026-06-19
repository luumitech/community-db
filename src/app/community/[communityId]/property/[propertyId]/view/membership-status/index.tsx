import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useLayoutContext as useViewLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql } from '~/graphql/generated';
import { Card } from '~/view/base/card';
import { RegisteredEventList } from './registered-event-list';
import { YearSelect } from './year-select';

const MembershipStatusFragment = graphql(/* GraphQL */ `
  fragment PropertyId_MembershipStatus on Property {
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

export const MembershipStatus: React.FC<Props> = ({ className }) => {
  const { minYear, maxYear } = useLayoutContext();
  const { property: propertyFragment } = useViewLayoutContext();
  const dispatch = useDispatch();
  const { yearSelected } = useSelector((state) => state.ui);
  const property = getFragment(MembershipStatusFragment, propertyFragment);
  const { membershipList } = property;

  const membership = React.useMemo(() => {
    const matched = membershipList.find(({ year }) => yearSelected === year);
    return matched;
  }, [membershipList, yearSelected]);

  return (
    <Card className={className}>
      <Card.Body className="gap-2">
        <YearSelect
          yearRange={[minYear, maxYear]}
          membershipList={property.membershipList}
          selectedYear={yearSelected}
          onYearChange={(year) => dispatch(actions.ui.setYearSelected(year))}
        />
        <RegisteredEventList membership={membership} />
      </Card.Body>
    </Card>
  );
};
