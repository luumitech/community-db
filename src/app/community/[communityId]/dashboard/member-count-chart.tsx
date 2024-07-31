import { useQuery } from '@apollo/client';
import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import { BarDatum, BarTooltipProps } from '@nivo/bar';
import { TableTooltip } from '@nivo/tooltip';
import clsx from 'clsx';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';
import { getItemColor } from '~/view/base/chart/item-color';

const MemberCountStatQuery = graphql(/* GraphQL */ `
  query memberCountStat($id: String!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
        maxYear
        memberCountStat {
          year
          renew
          new
          noRenewal
        }
      }
    }
  }
`);

interface ChartDataEntry {
  year: number;
  new: number;
  renewed: number;
  ['no renewal']: number;
}

class ChartDataHelper {
  constructor(private stat: GQL.MemberCountStat[]) {}

  getChartData() {
    const chartData: Readonly<ChartDataEntry>[] = [];
    this.stat.forEach((entry) => {
      chartData.push({
        year: entry.year,
        new: entry.new,
        renewed: entry.renew,
        ['no renewal']: -entry.noRenewal,
      });
    });
    return chartData;
  }
}

const CHART_KEYS = ['no renewal', 'renewed', 'new'];

const customTooltip: React.FC<BarTooltipProps<ChartDataEntry>> = ({ data }) => {
  const row = (labelKey: keyof ChartDataEntry) => {
    const value = Math.abs(data[labelKey] ?? 0).toString();
    return [
      <span
        key="symbol"
        className="block w-3 h-3"
        style={{
          backgroundColor: getItemColor(CHART_KEYS.indexOf(labelKey as string)),
        }}
      />,
      labelKey,
      <strong key="value">{value}</strong>,
    ];
  };

  return (
    <TableTooltip
      title={
        <div className="flex justify-between">
          <strong>{data.year}</strong>
          <strong>total: {(data.new ?? 0) + (data.renewed ?? 0)}</strong>
        </div>
      }
      rows={[row('new'), row('renewed'), row('no renewal')]}
    />
  );
};

interface Props {
  className?: string;
  communityId: string;
  onYearSelect?: (year: number) => void;
}

export const MemberCountChart: React.FC<Props> = ({
  className,
  communityId,
  onYearSelect,
}) => {
  const result = useQuery(MemberCountStatQuery, {
    variables: { id: communityId },
  });
  useGraphqlErrorHandler(result);

  const chartData = React.useMemo(() => {
    if (!result.data) {
      return [];
    }
    const { maxYear, memberCountStat } =
      result.data.communityFromId.communityStat;
    // Whenever new statistics are loaded, show yearly chart for the maxYear
    onYearSelect?.(maxYear);
    const chartHelper = new ChartDataHelper(memberCountStat);
    return chartHelper.getChartData();
  }, [result.data, onYearSelect]);

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
        <Skeleton className="rounded-lg" isLoaded={!result.loading}>
          <BarChart
            className="h-[400px]"
            data={chartData}
            onDataClick={(data) => onYearSelect?.(data.year as number)}
            keys={CHART_KEYS}
            indexBy="year"
            // Format negative values as +ve (i.e. no renewal counts are negative)
            valueFormat={(v) => Math.abs(v).toString()}
            axisBottom={{
              legend: 'Year',
              // Only show even number year on x-axis
              format: (v) => (v % 2 ? '' : v),
            }}
            axisLeft={{
              legend: 'Member Count',
            }}
            tooltip={
              customTooltip as unknown as React.FC<BarTooltipProps<BarDatum>>
            }
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
