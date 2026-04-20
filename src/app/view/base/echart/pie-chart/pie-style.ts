import type { PieSeriesOption } from 'echarts';
import { EChartTheme } from '../use-echart-theme';

type PieSeriesData = OnlyObject<NonNullable<PieSeriesOption['data']>[number]>;

interface PieStyleOpt {
  showCategory?: boolean;
  showValue?: boolean;
  isSelected?: boolean;
}

/**
 * Custom pie label that hides label if value is zero
 *
 * Used in 'series' option:
 *
 *     series: [
 *       {
 *         type: 'pie',
 *         data: {
 *           ...,
 *           ...pieSeriesStyle(),
 *         }
 *       }
 *     ]
 */
export function pieSeriesStyle(
  theme: EChartTheme,
  opt?: PieStyleOpt
): PieSeriesData {
  const valueLabel = {
    position: 'inside',
    formatter: '{c}',
  } satisfies PieSeriesOption['label'];

  const categoryLabel = {
    show: true,
    formatter: '{b}',
    opacity: 1,
    color: theme.categoryAxis.axisLabel.color,
  } satisfies PieSeriesOption['label'];

  const categoryLabelLine = {
    show: true,
    lineStyle: {
      opacity: 1,
    },
  } satisfies PieSeriesOption['labelLine'];

  return {
    ...(opt?.showCategory && {
      label: categoryLabel,
      labelLine: categoryLabelLine,
    }),
    ...(opt?.showValue && { label: valueLabel }),
    itemStyle: {
      borderRadius: 3,
      ...(opt?.isSelected && theme.selectedItemStyle),
      // Hide each slice when showing category labels
      ...(opt?.showCategory && { opacity: 0 }),
    },
  };
}
