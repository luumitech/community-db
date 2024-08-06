import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { PieChart } from '~/view/base/chart';
import { type DashboardEntry } from './_type';

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

interface ChartDataEntry {
  id: string;
  label: string;
  value: number;
}

class ChartDataHelper {
  private eventStat: Pick<GQL.EventStat, 'eventName' | 'new' | 'renew'>[];

  constructor(fragment: GQL.Dashboard_MembershipSourceFragment) {
    this.eventStat = fragment.communityStat.eventStat;
  }

  getChartData() {
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.eventStat.forEach((entry) => {
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
  const entry = getFragment(MembershipSourceFragment, fragment);

  const chartData = React.useMemo(() => {
    if (!entry) {
      return [];
    }
    const chartHelper = new ChartDataHelper(entry);
    return chartHelper.getChartData();
  }, [entry]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Membership Source`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg" isLoaded={!isLoading}>
          <PieChart className="h-[400px]" data={chartData} />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
