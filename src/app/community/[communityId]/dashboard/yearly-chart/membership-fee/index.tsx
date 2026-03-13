import { Card, CardBody, CardHeader, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { useYearlyContext } from '../yearly-context';
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

interface Props {
  className?: string;
}

export const MembershipFee: React.FC<Props> = ({ className }) => {
  const { community, year, isLoading } = useYearlyContext();
  const entry = getFragment(EventMembershipFragment, community);

  const membershipFeeStat = entry?.communityStat.membershipFeeStat ?? [];

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-md font-bold">{`${year} Membership Fee`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton
          className="min-h-[400px] rounded-lg"
          aria-label="skeleton"
          isLoaded={!isLoading}
        >
          <MembershipFeeTable membershipFeeStat={membershipFeeStat} />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
