import type { BarSeriesOption } from 'echarts';
import { EChartTheme } from '../use-echart-theme';

type BarSeriesData = OnlyObject<NonNullable<BarSeriesOption['data']>[number]>;

interface BarStyleOpt {
  isSelected?: boolean;
}

/**
 * Custom bar label that renders value within the bar
 *
 * Used in 'series' option:
 *
 *     series: [
 *       {
 *         type: 'bar',
 *         stack: 'members',
 *         data: {
 *           ...,
 *           ...barStyle(),
 *         }
 *       }
 *     ]
 *
 * - Add label within the bar
 * - Apply selected style
 */
export function barStyle(theme: EChartTheme, opt?: BarStyleOpt): BarSeriesData {
  /** Add label in the middle of the bar */
  const label = {
    show: true,
    position: 'inside',
    // formatter: '{c}',
    formatter: (params) => {
      const value = (params.value ?? 0) as number;
      return value < 5 ? '' : value.toString();
    },
  } satisfies BarSeriesOption['label'];

  return {
    label,
    itemStyle: {
      ...(opt?.isSelected && theme.selectedItemStyle),
    },
  } satisfies BarSeriesOption;
}
