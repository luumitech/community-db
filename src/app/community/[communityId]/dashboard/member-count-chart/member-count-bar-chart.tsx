import { Divider, cn } from '@heroui/react';
import { BarCustomLayerProps, BarLegendProps } from '@nivo/bar';
import { SymbolProps } from '@nivo/legends';
import { line } from 'd3-shape';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import {
  BarChart,
  barHighlightSelected,
  barSelectable,
  getItemColor,
} from '~/view/base/chart';
import { TableTooltip } from '~/view/base/chart/tooltip';
import { ChartDataHelperUtil } from '../chart-data-helper';
import { type MemberCountEntry } from './_type';

const MemberCountFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MemberCount on Community {
    communityStat {
      id
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

class ChartDataHelper extends ChartDataHelperUtil<ChartDataEntry> {
  private stat: GQL.ByYearStat[];
  // There is also a 'no renewal' key in the data that is represented by
  // a customLine plot
  public chartKeys = ['renewed', 'new'];

  constructor(stat: GQL.ByYearStat[], yearRange: number) {
    super();
    if (yearRange > 0) {
      this.stat = stat.slice(-yearRange);
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
    if (label === 'no renewal') {
      return getItemColor(0);
    }
    const itemIdx = this.chartKeys.indexOf(label as string);
    if (itemIdx !== -1) {
      return getItemColor(itemIdx + 1);
    }
    return getItemColor(0);
  }
}

/**
 * Custom line plot
 *
 * For members who have not renewed this year
 */
function noRenewalLine(helper: ChartDataHelper) {
  const Line: React.FC<BarCustomLayerProps<ChartDataEntry>> = ({
    bars,
    xScale,
    yScale,
  }) => {
    /**
     * Gather necessary information to plot the line graph (as well as
     * implementing custom tooltip)
     */
    const chartData = React.useMemo(() => {
      return helper.chartData.map((datum) => {
        const bar = bars.find(
          ({ data: { indexValue } }) => indexValue === datum.year
        );
        if (!bar) {
          throw new Error(
            'Unexpected error. Cannot find bar associated with chartData'
          );
        }
        return {
          year: datum.year,
          lineX: xScale(datum.year) + bar.width / 2,
          lineY: yScale(datum['no renewal']),
          barX: xScale(datum.year),
          barWidth: bar.width,
          data: datum,
        };
      });
    }, [bars, xScale, yScale]);
    const lineColor = helper.getDataColor('no renewal');
    const lineGenerator = line<(typeof chartData)[0]>()
      .x(({ lineX }) => lineX)
      .y(({ lineY }) => lineY);

    return (
      <>
        <path
          d={lineGenerator(chartData) ?? undefined}
          className="fill-none"
          stroke={lineColor}
          strokeWidth={2}
        />
        {chartData.map((datum) => (
          <circle
            key={datum.year}
            className={cn('fill-background')}
            cx={datum.lineX}
            cy={datum.lineY}
            r={4}
            stroke={lineColor}
          />
        ))}
      </>
    );
  };
  return Line;
}

/** Custom legend for bar chart */
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

/** Custom tool tip when hovering over bars */
function customTooltip(helper: ChartDataHelper) {
  // const Tooltip: React.FC<BarTooltipProps<ChartDataEntry>> = ({ data }) => {
  const Tooltip: React.FC<{ data: ChartDataEntry }> = ({ data }) => {
    const dataValue = React.useCallback(
      (labelKey: keyof ChartDataEntry) => {
        const entry = helper.chartData.find(({ year }) => year === data.year);
        return entry?.[labelKey as keyof typeof entry] ?? 0;
      },
      [data]
    );

    const row = React.useCallback(
      (symbol: 'bar' | 'line' | 'none', label: string, value: number) => {
        const itemColor = helper.getDataColor(label);
        const firstCol = (
          <span
            className={cn(
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
  /** Number of years to show on the chart */
  yearRange: number;
  selectedYear?: number;
  onYearSelect?: (year: number) => void;
}

export const MemberCountBarChart: React.FC<Props> = ({
  className,
  fragment,
  yearRange,
  selectedYear,
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

  const { chartData } = chartHelper;

  const CustomBar = React.useMemo(
    () => barHighlightSelected(chartData, selectedYear),
    [chartData, selectedYear]
  );
  const NoRenewalLine = React.useMemo(
    () => noRenewalLine(chartHelper),
    [chartHelper]
  );
  const CustomTooltip = React.useMemo(
    () => customTooltip(chartHelper),
    [chartHelper]
  );
  const SelectableBar = React.useMemo(
    () =>
      barSelectable(chartData, {
        renderToolTip: (data) => <CustomTooltip data={data} />,
        onDataClick: (data) => onYearSelect?.(data.year),
      }),
    [chartData, CustomTooltip, onYearSelect]
  );
  const barLegend = React.useMemo(
    () => customLegend(chartHelper),
    [chartHelper]
  );
  const gridYValues = React.useMemo(
    () => chartHelper.getIntegerTicks(10, (data) => data.new + data.renewed),
    [chartHelper]
  );

  return (
    <BarChart
      className={cn(className, 'min-h-[400px]')}
      data={chartData}
      colors={(datum) => chartHelper.getDataColor(datum.id)}
      // This is being hidden by the bars rendered by NoRenewalLine
      // onDataClick={(data) => onYearSelect?.(data.year as number)}
      keys={chartHelper.chartKeys}
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
      gridYValues={gridYValues}
      axisLeft={{
        legend: 'Member Count',
        tickValues: gridYValues,
      }}
      // These tooltip would only show if you hover over the bar
      // We want to show tooltip as long as we are hovering over the column
      // containing the bar, so we implement the tooltip in NoRenewalLine
      // tooltip={CustomTooltip}
      legends={[barLegend]}
      layers={[
        'grid',
        'axes',
        // 'bars',
        CustomBar,
        NoRenewalLine,
        SelectableBar,
        'markers',
        'legends',
      ]}
    />
  );
};
