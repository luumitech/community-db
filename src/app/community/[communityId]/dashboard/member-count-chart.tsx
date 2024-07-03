import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import * as R from 'remeda';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';
import { type DashboardEntry } from './_type';

interface ChartDataEntry {
  year: number;
  renew: number;
  new: number;
}

const MemberCountFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MemberCount on Community {
    communityStat {
      minYear
      maxYear
      propertyStat {
        year
        joinEvent
        otherEvents
        renew
      }
    }
  }
`);

type PropertyStat =
  GQL.Dashboard_MemberCountFragment['communityStat']['propertyStat'][0];

class ChartDataHelper {
  private dataMap = new Map<number, Omit<PropertyStat, 'year'>[]>();

  constructor(fragment: GQL.Dashboard_MemberCountFragment) {
    const { minYear, maxYear } = fragment.communityStat;
    // Year should be in descending order
    R.range(minYear, maxYear + 1)
      .reverse()
      .forEach((year) => {
        this.dataMap.set(year, []);
      });
  }

  getYear(year: number) {
    const result = this.dataMap.get(year);
    if (result == null) {
      throw new Error(`Unexpected year ${year} requested`);
    }
    return result;
  }

  getChartData() {
    // propagate to chart data
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.dataMap.forEach((entries, year) => {
      const renewList = entries.filter((entry) => entry.renew);
      chartData.push({
        year,
        renew: renewList.length,
        new: entries.length - renewList.length,
      });
    });

    return chartData;
  }
}

interface Props {
  className?: string;
  fragment: DashboardEntry;
  onDataClick?: (datum: ChartDataEntry) => void;
}

export const MemberCountChart: React.FC<Props> = ({
  className,
  fragment,
  onDataClick,
}) => {
  const entry = getFragment(MemberCountFragment, fragment);

  const chartData = React.useMemo(() => {
    const chartHelper = new ChartDataHelper(entry);
    const { propertyStat } = entry.communityStat;
    propertyStat.forEach(({ year, ...stat }) => {
      chartHelper.getYear(year).push(stat);
    });
    return chartHelper.getChartData();
  }, [entry]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">Total Membership Counts</p>
          <p className="text-small text-default-500">
            Click on a year, to view details for each year
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <BarChart
          className="h-[400px]"
          data={chartData}
          onDataClick={onDataClick}
          keys={['renew', 'new']}
          indexBy="year"
          axisBottom={{
            legend: 'Year',
            // Only show even number year on x-axis
            format: (v) => (v % 2 ? '' : v),
          }}
          axisLeft={{
            legend: 'Member Count',
          }}
        />
      </CardBody>
    </Card>
  );
};
