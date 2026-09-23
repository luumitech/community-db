import { cn } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { getFragment, graphql } from '~/graphql/generated';
import { lsFlags } from '~/lib/env';
import { Card } from '~/view/base/card';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { GroupBy } from './group-by';
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
  const { community, isLoading } = usePageContext();
  const entry = getFragment(EventMembershipFragment, community);
  const [groupBy = 'none', setGroupBy] = useLocalStorage(
    lsFlags.dashboardMembershipFeeGroupBy,
    'none'
  );

  const membershipFeeStat = entry?.communityStat.membershipFeeStat ?? [];

  return (
    <Card className={cn(className, 'h-full')}>
      <Card.Body className="flex flex-col gap-2">
        <GroupBy defaultValue={groupBy} onValueChange={setGroupBy} />
        <MembershipFeeTable
          className="h-full"
          membershipFeeStat={membershipFeeStat}
          isLoading={isLoading}
          groupBy={groupBy}
        />
      </Card.Body>
    </Card>
  );
};

export const MembershipFee = {
  Chart,
  Title,
};
