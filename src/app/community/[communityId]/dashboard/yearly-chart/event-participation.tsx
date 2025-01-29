import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';
import { type DashboardEntry } from './_type';
import { useYearlyContext } from './yearly-context';

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

type EventStat =
  GQL.Dashboard_EventParticipationFragment['communityStat']['eventStat'];

interface ChartDataEntry {
  eventName: string;
  new: number;
  renewed: number;
  existing: number;
}

class ChartDataHelper {
  constructor(private stat: EventStat) {}

  getChartData() {
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.stat.forEach((entry) => {
      chartData.push({
        eventName: entry.eventName,
        new: entry.new,
        renewed: entry.renew,
        existing: entry.existing,
      });
    });
    return chartData;
  }
}

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
  const { setEventSelected } = useYearlyContext();
  const entry = getFragment(EventFragment, fragment);

  const chartData = React.useMemo(() => {
    const eventStat = entry?.communityStat.eventStat;
    if (!eventStat) {
      return [];
    }
    const chartHelper = new ChartDataHelper(eventStat);
    return chartHelper.getChartData();
  }, [entry]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Event Participation`}</p>
        </div>
      </CardHeader>
      <CardBody className="overflow-hidden">
        <Skeleton
          classNames={{
            base: 'rounded-lg h-full',
            content: 'h-full',
          }}
          isLoaded={!isLoading}
        >
          <BarChart
            className="min-h-[400px]"
            data={chartData}
            keys={['existing', 'renewed', 'new']}
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
            onDataClick={(data) => setEventSelected(data.eventName)}
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
