import { Divider } from '@nextui-org/react';
import { BarDatum, BarTooltipProps } from '@nivo/bar';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';
import { getItemColor } from '~/view/base/chart/item-color';
import { TableTooltip } from '~/view/base/chart/tooltip';
import { type MemberCountEntry } from './_type';

const MemberCountFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MemberCount on Community {
    communityStat {
      memberCountStat {
        year
        renew
        new
        noRenewal
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
  private stat: GQL.MemberCountStat[];
  constructor(stat: GQL.MemberCountStat[], yearRange: number) {
    if (yearRange > 0) {
      this.stat = stat.slice(0, yearRange);
    } else {
      this.stat = stat;
    }
  }

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

const CustomTooltip: React.FC<BarTooltipProps<ChartDataEntry>> = ({ data }) => {
  const dataValue = React.useCallback(
    (labelKey: keyof ChartDataEntry) => data[labelKey] ?? 0,
    [data]
  );

  const row = React.useCallback(
    (labelKey: keyof ChartDataEntry) => {
      const value = Math.abs(dataValue(labelKey)).toString();
      return [
        <span
          key="col-1"
          className="block w-3 h-3"
          style={{
            backgroundColor: getItemColor(
              CHART_KEYS.indexOf(labelKey as string)
            ),
          }}
        />,
        labelKey,
        <strong key="col-3">{value}</strong>,
      ];
    },
    [dataValue]
  );

  return (
    <TableTooltip
      title={<strong>{dataValue('year')}</strong>}
      rows={[
        row('new'),
        row('renewed'),
        [<Divider key="divider" />],
        [
          null,
          'total',
          <strong key="col-3">
            {dataValue('new') + dataValue('renewed')}
          </strong>,
        ],
        [null],
        row('no renewal'),
      ]}
    />
  );
};

interface Props {
  className?: string;
  fragment?: MemberCountEntry;
  /**
   * Number of years to show on the chart
   */
  yearRange: number;
  onYearSelect?: (year: number) => void;
}

export const MemberCountBarChart: React.FC<Props> = ({
  className,
  fragment,
  yearRange,
  onYearSelect,
}) => {
  const entry = getFragment(MemberCountFragment, fragment);
  const communityStat = entry?.communityStat;

  const chartData = React.useMemo(() => {
    if (!communityStat) {
      return [];
    }
    const { memberCountStat } = communityStat;
    const chartHelper = new ChartDataHelper(memberCountStat, yearRange);
    return chartHelper.getChartData();
  }, [communityStat, yearRange]);

  return (
    <BarChart
      className={clsx(className, 'h-[400px]')}
      data={chartData}
      onDataClick={(data) => onYearSelect?.(data.year as number)}
      keys={CHART_KEYS}
      indexBy="year"
      // Format negative values as +ve (i.e. no renewal counts are negative)
      valueFormat={(v) => Math.abs(v).toString()}
      axisBottom={{
        legend: 'Year',
        format: (v) => {
          if (chartData.length > 10) {
            // Only show even number year on x-axis
            return v % 2 ? '' : v;
          } else {
            return v;
          }
        },
      }}
      axisLeft={{
        legend: 'Member Count',
      }}
      tooltip={CustomTooltip as unknown as React.FC<BarTooltipProps<BarDatum>>}
    />
  );
};
