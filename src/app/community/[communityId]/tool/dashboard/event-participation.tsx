import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';

interface ChartDataEntry {
  event: string;
  renew: number;
  new: number;
  existing: number;
}

const EntryFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventParticipation on Community {
    eventList {
      name
      hidden
    }
    communityStat {
      propertyStat {
        year
        joinEvent
        otherEvents
        renew
      }
    }
  }
`);

export type CommunityFragmentType = FragmentType<typeof EntryFragment>;
type DataMapEntry = Omit<ChartDataEntry, 'event'>;

class ChartDataHelper {
  private dataMap = new Map<string, DataMapEntry>();

  static newItem(): DataMapEntry {
    return { renew: 0, new: 0, existing: 0 };
  }

  constructor(fragment: GQL.Dashboard_EventParticipationFragment) {
    const { eventList } = fragment;
    eventList.map((event) => {
      if (!event.hidden) {
        this.dataMap.set(event.name, ChartDataHelper.newItem());
      }
    });
  }

  getEvent(eventName: string) {
    const result = this.dataMap.get(eventName);
    if (result == null) {
      const item = ChartDataHelper.newItem();
      this.dataMap.set(eventName, item);
      return item;
    }
    return result;
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
  entry: CommunityFragmentType;
  year: number;
}

export const EventParticipation: React.FC<Props> = ({
  className,
  year,
  ...props
}) => {
  const entry = useFragment(EntryFragment, props.entry);

  const chartData = React.useMemo(() => {
    const chartHelper = new ChartDataHelper(entry);
    const { propertyStat } = entry.communityStat;
    propertyStat.forEach((stat) => {
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
