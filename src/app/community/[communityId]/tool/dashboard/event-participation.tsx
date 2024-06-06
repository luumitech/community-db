import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { BarChart } from '~/view/base/chart';

interface ChartDataEntry {
  event: string;
  renew: number;
  new: number;
  existing: number;
}

const EntryFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventParticipation on CommunityStat {
    propertyStat {
      year
      joinEvent
      otherEvents
      renew
    }
  }
`);

export type CommunityStatFragmentType = FragmentType<typeof EntryFragment>;

class ChartDataHelper {
  private dataMap = new Map<string, Omit<ChartDataEntry, 'event'>>();

  getEvent(eventName: string) {
    if (!this.dataMap.has(eventName)) {
      this.dataMap.set(eventName, {
        renew: 0,
        new: 0,
        existing: 0,
      });
    }
    return this.dataMap.get(eventName)!;
  }

  getChartData() {
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.dataMap.forEach((entry, event) => {
      chartData.push({ event, ...entry });
    });
    return chartData;
  }
}

interface Props {
  className?: string;
  entry: CommunityStatFragmentType;
  year: number;
}

export const EventParticipation: React.FC<Props> = ({
  className,
  year,
  ...props
}) => {
  const entry = useFragment(EntryFragment, props.entry);

  const chartData = React.useMemo(() => {
    const chartHelper = new ChartDataHelper();
    entry.propertyStat.forEach((stat) => {
      if (stat.year === year) {
        if (stat.renew) {
          chartHelper.getEvent(stat.joinEvent).renew++;
        } else {
          chartHelper.getEvent(stat.joinEvent).new++;
        }
        stat.otherEvents.forEach(
          (eventName) => chartHelper.getEvent(eventName).existing++
        );
      }
    });

    return chartHelper.getChartData();
  }, [entry, year]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Event Participation`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <BarChart
          className="h-[400px]"
          data={chartData}
          keys={['renew', 'new', 'existing']}
          indexBy="event"
          axisBottom={{
            legend: 'Event',
            tickRotation: -15,
          }}
          axisLeft={{
            legend: 'Member Count',
          }}
          enableTotals
          legendPos="bottom"
        />
      </CardBody>
    </Card>
  );
};
