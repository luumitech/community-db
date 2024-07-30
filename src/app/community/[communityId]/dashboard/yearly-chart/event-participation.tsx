import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { BarChart } from '~/view/base/chart';
import { type DashboardEntry } from './_type';

const EventFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventParticipation on Community {
    communityStat {
      eventStat(year: $year) {
        eventName
        new
        renew
        existing
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

export const EventParticipation: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
  const entry = getFragment(EventFragment, fragment);

  const chartData = React.useMemo(() => {
    return entry?.communityStat.eventStat ?? [];
  }, [entry]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Event Participation`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg" isLoaded={!isLoading}>
          <BarChart
            className="h-[400px]"
            data={chartData}
            keys={['renew', 'new', 'existing']}
            indexBy="eventName"
            margin={{
              bottom: 100,
            }}
            axisBottom={{
              legend: 'Event',
              tickRotation: -15,
              legendOffset: 55,
            }}
            axisLeft={{
              legend: 'Member Count',
            }}
            enableTotals
            legendPos="bottom"
            legendProp={{
              translateY: 90,
            }}
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
