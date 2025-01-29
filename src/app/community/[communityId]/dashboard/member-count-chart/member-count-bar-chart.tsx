import { Divider } from '@heroui/react';
import { BarCustomLayerProps, BarLegendProps } from '@nivo/bar';
import { SymbolProps } from '@nivo/legends';
import clsx from 'clsx';
import { line } from 'd3-shape';
import React from 'react';
import * as R from 'remeda';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';
import { getItemColor } from '~/view/base/chart/item-color';
import { TableTooltip, useTooltip } from '~/view/base/chart/tooltip';
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
 * Custom bar
 *
 * Add pattern overlay to selected bar
 */
function customBar(helper: ChartDataHelper, selectedYear?: number) {
  const Bar: React.FC<BarCustomLayerProps<ChartDataEntry>> = ({ bars }) => {
    // Render the bars normally (without selected pattern overlay)
    const barRects = bars.map((bar) => {
      return (
        <svg
          key={bar.key}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
        >
          <rect width="100%" height="100%" fill={bar.color} />
        </svg>
      );
    });

    // Renders the value of each bar
    const barLabels = bars.map((bar) => {
      return (
        <svg
          key={bar.key}
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
        >
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="font-sans text-[11px] fill-[rgb(79,109,140)]"
          >
            {bar.data.formattedValue}
          </text>
        </svg>
      );
    });

    // Render the selected bar with pattern overlay
    let selectedSvg = null;
    const selectedBars = bars.filter(
      (bar) => selectedYear === bar.data.indexValue
    );
    if (selectedBars.length) {
      const x = selectedBars[0].x;
      const y = Math.min(...selectedBars.map((bar) => bar.y));
      const width = selectedBars[0].width;
      const height = R.sum(selectedBars.map((bar) => bar.height));
      const patternId = `pattern_${selectedBars[0].key}`;
      selectedSvg = (
        <svg x={x} y={y} width={width} height={height}>
          <defs>
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="16"
              height="16"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y="0"
                x2="0"
                y2="16"
                stroke="white"
                strokeWidth="3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      );
    }

    return (
      <>
        {barRects}
        {selectedSvg}
        {barLabels}
      </>
    );
  };
  return Bar;
}

/**
 * Custom line plot
 *
 * For members who have not renewed this year
 */
function noRenewalLine(
  helper: ChartDataHelper,
  onYearSelect?: (year: number) => void
) {
  const Line: React.FC<BarCustomLayerProps<ChartDataEntry>> = ({
    bars,
    xScale,
    yScale,
    innerHeight,
  }) => {
    const tip = useTooltip();
    const CustomTooltip = React.useMemo(() => customTooltip(helper), []);

    const renderTooltip = React.useCallback(
      (evt: React.MouseEvent, datum: ChartDataEntry) => {
        return tip.showTooltipFromEvent(<CustomTooltip data={datum} />, evt);
      },
      [tip, CustomTooltip]
    );

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
          <React.Fragment key={datum.year}>
            <circle
              className={clsx('fill-background')}
              cx={datum.lineX}
              cy={datum.lineY}
              r={4}
              stroke={lineColor}
            />
            <rect
              className={clsx('fill-transparent')}
              x={datum.barX}
              y={0}
              height={innerHeight}
              width={datum.barWidth}
              onMouseEnter={(evt) => renderTooltip(evt, datum.data)}
              onMouseMove={(evt) => renderTooltip(evt, datum.data)}
              onMouseLeave={tip.hideTooltip}
              onClick={() => onYearSelect?.(datum.year)}
            />
          </React.Fragment>
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

  const CustomBar = React.useMemo(
    () => customBar(chartHelper, selectedYear),
    [chartHelper, selectedYear]
  );
  const NoRenewalLine = React.useMemo(
    () => noRenewalLine(chartHelper, onYearSelect),
    [chartHelper, onYearSelect]
  );
  const barLegend = React.useMemo(
    () => customLegend(chartHelper),
    [chartHelper]
  );

  const { chartData } = chartHelper;

  return (
    <BarChart
      className={clsx(className, 'min-h-[400px]')}
      data={chartData}
      colors={(datum) => chartHelper.getDataColor(datum.id)}
      // This is being hidden by the bars rendered by NoRenewalLine
      // onDataClick={(data) => onYearSelect?.(data.year as number)}
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
        'markers',
        'legends',
      ]}
    />
  );
};
