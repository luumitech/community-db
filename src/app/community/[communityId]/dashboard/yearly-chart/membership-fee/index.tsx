import { Card, CardBody, CardHeader, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type DashboardEntry } from '../_type';
import { MembershipFeeTable } from './membership-fee-table';

const EventMembershipFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventMembership on Community {
    communityStat {
      eventStat(year: $year) {
        eventName
        membershipList {
          count
          price
          paymentMethod
        }
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

  const eventStat = entry?.communityStat.eventStat ?? [];
  const membershipList = eventStat
    .map((statEntry) =>
      statEntry.membershipList.map((mapEntry) => ({
        eventName: statEntry.eventName,
        ...mapEntry,
      }))
    )
    .flat();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Membership Fee`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg min-h-[400px]" isLoaded={!isLoading}>
          <MembershipFeeTable membershipList={membershipList} />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
