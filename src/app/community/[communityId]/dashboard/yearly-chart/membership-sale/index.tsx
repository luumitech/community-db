import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type DashboardEntry } from '../_type';
import { MembershipSaleTable } from './membership-sale-table';

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

export const MembershipSale: React.FC<Props> = ({
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
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Membership Sale`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg" isLoaded={!isLoading}>
          <MembershipSaleTable membershipList={membershipList} />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
