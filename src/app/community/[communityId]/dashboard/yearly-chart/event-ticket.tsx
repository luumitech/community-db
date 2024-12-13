import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';
import { type DashboardEntry } from './_type';

const EventFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventTicket on Community {
    communityStat {
      eventStat(year: $year) {
        eventName
        ticket
      }
    }
  }
`);

type EventStat =
  GQL.Dashboard_EventTicketFragment['communityStat']['eventStat'];

interface ChartDataEntry {
  eventName: string;
  ticket: number;
}

class ChartDataHelper {
  constructor(private stat: EventStat) {}

  getChartData() {
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.stat.forEach((entry) => {
      chartData.push({
        eventName: entry.eventName,
        ticket: entry.ticket,
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

export const EventTicket: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
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
          <p className="font-bold text-md">{`${year} Event Ticket Sale`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg" isLoaded={!isLoading}>
          <BarChart
            className="h-[400px]"
            data={chartData}
            keys={['ticket']}
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
              legend: 'Ticket Count',
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
