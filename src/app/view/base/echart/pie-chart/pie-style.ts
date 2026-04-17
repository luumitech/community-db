import type { PieSeriesOption } from 'echarts';
import { defaultStyle } from '../common-style';

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
export function pieSeriesStyle(opt?: PieStyleOpt): PieSeriesData {
  const valueLabel = {
    ...defaultStyle.label,
    position: 'inside',
    formatter: '{c}',
  } satisfies PieSeriesOption['label'];

  const categoryLabel = {
    ...defaultStyle.label,
    formatter: '{b}',
    opacity: 1,
  } satisfies PieSeriesOption['label'];

  const categoryLabelLine = {
    show: true,
    lineStyle: {
      opacity: 1,
    },
  } satisfies PieSeriesOption['labelLine'];

  const selectedItemStyle = {
    ...defaultStyle.selectedItemStyle,
  } satisfies PieSeriesOption['itemStyle'];

  return {
    label: {
      show: false,
    },
    ...(opt?.showCategory && {
      label: categoryLabel,
      labelLine: categoryLabelLine,
    }),
    ...(opt?.showValue && { label: valueLabel }),
    itemStyle: {
      borderRadius: 3,
      ...(opt?.isSelected && selectedItemStyle),
      // Hide each slice when showing category labels
      ...(opt?.showCategory && { opacity: 0 }),
    },
  };
}
