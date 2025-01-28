import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { PieChart } from '~/view/base/chart';
import { type DashboardEntry } from './_type';
import { useYearlyContext } from './yearly-context';

const MembershipSourceFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MembershipSource on Community {
    communityStat {
      eventStat(year: $year) {
        eventName
        new
        renew
      }
    }
  }
`);

type EventStat =
  GQL.Dashboard_MembershipSourceFragment['communityStat']['eventStat'];

interface ChartDataEntry {
  id: string;
  label: string;
  value: number;
}

class ChartDataHelper {
  constructor(private stat: EventStat) {}

  getChartData() {
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.stat.forEach((entry) => {
      const value = entry.new + entry.renew;
      // Filter out events with no member sign-up
      if (value) {
        chartData.push({
          id: entry.eventName,
          label: entry.eventName,
          value,
        });
      }
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

export const MembershipSource: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
  const { setEventSelected } = useYearlyContext();
  const entry = getFragment(MembershipSourceFragment, fragment);

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
          <p className="font-bold text-md">{`${year} Membership Source`}</p>
        </div>
      </CardHeader>
      <CardBody className="overflow-hidden">
        <Skeleton className="rounded-lg" isLoaded={!isLoading}>
          <PieChart
            className="h-[400px]"
            data={chartData}
            onClick={(data) => setEventSelected(data.data.label)}
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
