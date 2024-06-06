import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { PieChart } from '~/view/base/chart';

interface ChartDataEntry {
  id: string;
  label: string;
  value: number;
  new: number;
  renew: number;
}

const EntryFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MembershipSource on CommunityStat {
    propertyStat {
      year
      joinEvent
      renew
    }
  }
`);

export type CommunityStatFragmentType = FragmentType<typeof EntryFragment>;

class ChartDataHelper {
  private dataMap = new Map<
    string,
    Omit<ChartDataEntry, 'id' | 'label' | 'value'>
  >();

  getEvent(eventName: string) {
    if (!this.dataMap.has(eventName)) {
      this.dataMap.set(eventName, {
        renew: 0,
        new: 0,
      });
    }
    return this.dataMap.get(eventName)!;
  }

  getChartData() {
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.dataMap.forEach((entry, event) => {
      chartData.push({
        id: event,
        label: event,
        value: entry.new + entry.renew,
        ...entry,
      });
    });
    return chartData;
  }
}

interface Props {
  className?: string;
  entry: CommunityStatFragmentType;
  year: number;
}

export const MembershipSource: React.FC<Props> = ({
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
      }
    });

    return chartHelper.getChartData();
  }, [entry, year]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Membership Source`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <PieChart
          className="h-[400px]"
          data={chartData}
          // keys={['renew', 'new', 'existing']}
          // indexBy="event"
          // axisBottom={{
          //   legend: 'Event',
          //   tickRotation: -15,
          // }}
          // axisLeft={{
          //   legend: 'Member Count',
          // }}
          // enableTotals
          // legendPos="bottom"
        />
      </CardBody>
    </Card>
  );
};
