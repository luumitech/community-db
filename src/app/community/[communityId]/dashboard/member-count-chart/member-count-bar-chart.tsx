import { Divider } from '@nextui-org/react';
import {
  BarCustomLayerProps,
  BarLegendProps,
  BarTooltipProps,
} from '@nivo/bar';
import { SymbolProps } from '@nivo/legends';
import clsx from 'clsx';
import { line } from 'd3-shape';
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

interface ChartDataEntry extends Record<string, number> {
  year: number;
  new: number;
  renewed: number;
  'no renewal': number;
}

class ChartDataHelper {
  private stat: GQL.MemberCountStat[];
  public chartData: Readonly<ChartDataEntry>[];
  constructor(stat: GQL.MemberCountStat[], yearRange: number) {
    if (yearRange > 0) {
      this.stat = stat.slice(0, yearRange);
    } else {
      this.stat = stat;
    }

    this.chartData = this.stat.map((entry) => ({
      year: entry.year,
      new: entry.new,
      renewed: entry.renew,
      ['no renewal']: entry.noRenewal,
    }));
  }

  getDataColor(label: keyof ChartDataEntry) {
    switch (label) {
      case 'new':
        return '#BDE2B9';
      case 'renewed':
        return '#8BC1F7';
      case 'no renewal':
        return '#ED7D31';
    }
    return getItemColor(0);
  }
}

const CHART_KEYS = ['renewed', 'new'];

/**
 * Custom line plot
 * for members who have not renewed this year
 */
function noRenewalLine(helper: ChartDataHelper) {
  const Line: React.FC<BarCustomLayerProps<ChartDataEntry>> = ({
    bars,
    xScale,
    yScale,
  }) => {
    const barWidth = bars.find(({ width }) => width != null)?.width ?? 0;
    const lineCoord = helper.chartData.map((datum) => ({
      year: datum.year,
      x: xScale(datum.year) + barWidth / 2,
      y: yScale(datum['no renewal']),
    }));
    const lineColor = helper.getDataColor('no renewal');
    const lineGenerator = line<(typeof lineCoord)[0]>()
      .x(({ x }) => x)
      .y(({ y }) => y);

    return (
      <>
        <path
          d={lineGenerator(lineCoord) ?? undefined}
          className="fill-none"
          stroke={lineColor}
          strokeWidth={2}
        />
        {lineCoord.map(({ x, y, year }) => (
          <circle
            key={year}
            className={clsx('fill-background')}
            cx={x}
            cy={y}
            r={4}
            stroke={lineColor}
          />
        ))}
      </>
    );
  };
  return Line;
}

/**
 * Custom legend for bar chart
 */
function customLegend(helper: ChartDataHelper) {
  const CustomSymbolShape: React.FC<SymbolProps> = ({
    id,
    x,
    size,
    borderWidth,
    borderColor,
  }) => {
    // Height of legend symbol
    const legendHeight = 20;
    const symHeight = id === 'no renewal' ? 2 : size;
    const fillColor = helper.getDataColor(id);
    return (
      <rect
        x={x}
        y={(legendHeight - symHeight) / 2}
        fill={fillColor}
        strokeWidth={borderWidth}
        stroke={borderColor}
        width={size}
        height={symHeight}
      />
    );
  };

  const legendProps: BarLegendProps = {
    // Not used since we are providing custom data
    dataFrom: 'keys',
    data: [
      { id: 'new', label: 'new' },
      { id: 'renewed', label: 'renewed' },
      { id: 'no renewal', label: 'no renewal' },
    ],
    anchor: 'bottom-right',
    direction: 'column',
    translateX: 120,
    itemWidth: 100,
    itemHeight: 20,
    symbolShape: CustomSymbolShape,
  };
  return legendProps;
}

/**
 * Custom tool tip when hovering over bars
 */
function customTooltip(helper: ChartDataHelper) {
  const Tooltip: React.FC<BarTooltipProps<ChartDataEntry>> = ({ data }) => {
    const dataValue = React.useCallback(
      (labelKey: keyof ChartDataEntry) => {
        const entry = helper.chartData.find(({ year }) => year === data.year);
        return entry?.[labelKey] ?? 0;
      },
      [data]
    );

    const row = React.useCallback(
      (symbol: 'bar' | 'line' | 'none', label: string, value: number) => {
        const itemColor = helper.getDataColor(label);
        const firstCol = (
          <span
            className={clsx(
              'block w-3 mt-[3px]',
              symbol === 'bar' && 'h-3',
              symbol === 'line' && 'h-[1px]'
            )}
            style={{ backgroundColor: itemColor }}
          />
        );
        return [firstCol, label, <strong key="col-3">{value}</strong>];
      },
      []
    );

    return (
      <TableTooltip
        title={<strong>{dataValue('year')}</strong>}
        rows={[
          row('bar', 'new', dataValue('new')),
          row('bar', 'renewed', dataValue('renewed')),
          [<Divider key="divider" />],
          row('none', 'total', dataValue('new') + dataValue('renewed')),
          [null],
          row('line', 'no renewal', dataValue('no renewal')),
        ]}
      />
    );
  };
  return Tooltip;
}

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

  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(
      communityStat?.memberCountStat ?? [],
      yearRange
    );
    return helper;
  }, [communityStat, yearRange]);

  const NoRenewalLine = React.useMemo(
    () => noRenewalLine(chartHelper),
    [chartHelper]
  );
  const CustomTooltip = React.useMemo(
    () => customTooltip(chartHelper),
    [chartHelper]
  );
  const barLegend = React.useMemo(
    () => customLegend(chartHelper),
    [chartHelper]
  );

  const { chartData } = chartHelper;

  return (
    <BarChart
      className={clsx(className, 'h-[400px]')}
      data={chartData}
      colors={(datum) => chartHelper.getDataColor(datum.id)}
      onDataClick={(data) => onYearSelect?.(data.year as number)}
      keys={CHART_KEYS}
      indexBy="year"
      valueFormat={(v) => v.toString()}
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
      tooltip={CustomTooltip}
      legends={[barLegend]}
      layers={['grid', 'axes', 'bars', NoRenewalLine, 'markers', 'legends']}
    />
  );
};
