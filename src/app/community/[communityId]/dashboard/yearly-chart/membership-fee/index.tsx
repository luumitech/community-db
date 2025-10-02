import { Card, CardBody, CardHeader, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type DashboardEntry } from '../_type';
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
  fragment?: DashboardEntry;
  year: number;
  isLoading?: boolean;
}

export const MembershipFee: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
  const entry = getFragment(EventMembershipFragment, fragment);

  const membershipFeeStat = entry?.communityStat.membershipFeeStat ?? [];

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Membership Fee`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton
          className="rounded-lg min-h-[400px]"
          aria-label="skeleton"
          isLoaded={!isLoading}
        >
          <MembershipFeeTable membershipFeeStat={membershipFeeStat} />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
