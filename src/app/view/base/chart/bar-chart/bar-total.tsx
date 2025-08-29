import { cn } from '@heroui/react';
import {
  BarCustomLayerProps,
  type BarDatum,
  type ComputedBarDatum,
} from '@nivo/bar';
import React from 'react';
import * as R from 'remeda';

/**
 * Render bar total on the stacked bar chart
 *
 * - This does the same as `enableTotal` with the `totals` layers added, except
 *   there is no default animation applied
 * - Allow customization on what to display on the total
 *
 * To Install:
 *
 * ```ts
 * const CustomTotals = React.useMemo(() => {
 *   return barTotal(chartData, (data) => 'custom label');
 * }, [chartData]);
 *
 * return (
 *   <BarChart
 *     data={chartData}
 *     // enableTotals
 *     layers={[
 *       'grid',
 *       'axes',
 *       'bars',
 *       // 'totals',
 *       CustomTotals,
 *       'markers',
 *       'legends',
 *     ]}
 *   />
 * );
 * ```
 *
 * @param chartData
 * @param layout Chart orientation, horizonal or vertical
 * @param totalFn Custom callback for calculating total of each data point
 * @returns
 */
export function barTotal<T extends BarDatum>(
  chartData: T[],
  layout: 'vertical' | 'horizontal',
  totalFn?: (data: T) => string
) {
  const TotalLabel: React.FC<BarCustomLayerProps<T>> = (props) => {
    // Group the bars according to the specified indexValue groupings
    const groups = R.groupBy(props.bars, ({ data }) => data.indexValue);

    // Calculate the total for each group
    const barLabels = Object.values(groups).map((bars) => {
      const firstBar = bars[0];
      const total = totalFn
        ? totalFn(firstBar.data.data)
        : defaultTotalFn(bars);
      const x =
        layout === 'vertical'
          ? firstBar.x + firstBar.width / 2
          : R.sumBy(bars, (bar) => bar.width) + 10;
      const y =
        layout === 'vertical'
          ? R.firstBy(bars, (bar) => bar.y).y - 10
          : firstBar.y + firstBar.height / 2;

      return (
        <text
          key={firstBar.data.indexValue}
          className={cn(
            'font-sans font-bold text-[11px]',
            'fill-[rgb(17,24,28)] dark:fill-[rgb(161,161,170)]'
          )}
          x={x}
          y={y}
          {...(layout === 'vertical'
            ? { textAnchor: 'middle', alignmentBaseline: 'alphabetic' }
            : { textAnchor: 'start', alignmentBaseline: 'middle' })}
        >
          {total}
        </text>
      );
    });

    return barLabels;
  };

  return TotalLabel;
}

/**
 * Calculate total value of the input bars
 *
 * - The bar value is calculated by taking the label value for each stacked bar.
 * - If all bars have NaN value (i.e. not existent), then return 'n/a'
 * - Otherwise sum up all total (treat NaN as 0)
 */
function defaultTotalFn<T extends BarDatum>(bars: ComputedBarDatum<T>[]) {
  // Interpret datapoint value
  const barValue = (bar: ComputedBarDatum<T>) => {
    const { data } = bar;
    // @ts-expect-error indexing into unknown data type is allowed here
    const val: number | undefined | null = data.data[data.id];
    return val ?? NaN;
  };

  // Data point not available if every value is NaN
  const noData = bars.every((bar) => {
    const val = barValue(bar);
    return isNaN(val);
  });
  if (noData) {
    return 'n/a';
  }

  return R.sumBy(bars, (bar) => {
    const val = barValue(bar);
    return isNaN(val) ? 0 : val;
  });
}
