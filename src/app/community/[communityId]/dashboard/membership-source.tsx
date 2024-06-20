import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { PieChart } from '~/view/base/chart';
import { type DashboardEntry } from './_type';

interface ChartDataEntry {
  id: string;
  label: string;
  value: number;
  new: number;
  renew: number;
}

const MembershipSourceFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MembershipSource on Community {
    eventList {
      name
      hidden
    }
    communityStat {
      propertyStat {
        year
        joinEvent
        renew
      }
    }
  }
`);

export type MembershipSourceFragmentType = FragmentType<
  typeof MembershipSourceFragment
>;
type DataMapEntry = Omit<ChartDataEntry, 'id' | 'label' | 'value'>;

class ChartDataHelper {
  private dataMap = new Map<string, DataMapEntry>();

  static newItem(): DataMapEntry {
    return { renew: 0, new: 0 };
  }

  constructor(fragment: GQL.Dashboard_MembershipSourceFragment) {
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
      const value = entry.new + entry.renew;
      // Filter out entry with no count
      if (value) {
        chartData.push({
          id: event,
          label: event,
          value,
          ...entry,
        });
      }
    });
    return chartData;
  }
}

interface Props {
  className?: string;
  fragment: DashboardEntry;
  year: number;
}

export const MembershipSource: React.FC<Props> = ({
  className,
  fragment,
  year,
}) => {
  const entry = useFragment(MembershipSourceFragment, fragment);

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
        <PieChart className="h-[400px]" data={chartData} />
      </CardBody>
    </Card>
  );
};
