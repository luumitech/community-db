import { Card, CardBody, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { MembershipFeeTable } from './membership-fee-table';

const EventMembershipFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventMembership on Community {
    communityStat {
      membershipFeeStat(year: $year) {
        key
        eventName
        membershipYear
        paymentMethod
        count
        price
      }
    }
  }
`);

const Title: React.FC = () => {
  const { year } = usePageContext();
  return (
    <WidgetTitle>{`${year} ${allowableWidgets.membershipFee.info.label}`}</WidgetTitle>
  );
};

interface Props {
  className?: string;
}

const Chart: React.FC<Props> = ({ className }) => {
  const { community, year, isLoading } = usePageContext();
  const entry = getFragment(EventMembershipFragment, community);

  const membershipFeeStat = entry?.communityStat.membershipFeeStat ?? [];

  return (
    <Card className={cn(className)}>
      <CardBody>
        <Skeleton
          className="h-full rounded-lg"
          aria-label="skeleton"
          isLoaded={!isLoading}
        >
          <MembershipFeeTable membershipFeeStat={membershipFeeStat} />
        </Skeleton>
      </CardBody>
    </Card>
  );
};

export const MembershipFee = {
  Chart,
  Title,
};
