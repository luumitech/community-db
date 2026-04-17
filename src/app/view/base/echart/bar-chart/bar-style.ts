import type { BarSeriesOption } from 'echarts';

/**
 * Custom bar label that renders value within the bar
 *
 * Used in 'series' option:
 *
 *     series: [
 *       {
 *         type: 'bar',
 *         stack: 'members',
 *         data: ...,
 *         label: barLabel,
 *       }
 *     ]
 */
export const barSeriesLabel = {
  show: true,
  position: 'inside',
  color: 'rgb(79,109,140)',
  fontSize: 11,
  fontFamily: 'sans-serif',
  // formatter: '{c}',
  formatter: (params) => {
    const value = (params.value ?? 0) as number;
    return value < 5 ? '' : value.toString();
  },
} satisfies BarSeriesOption['label'];

/** Custom style to apply on bar that has been selected */
export const barSeriesSelectedItemStyle = {
  decal: {
    symbol: 'rect',
    color: 'rgba(255,255,255,0.8)',
    dashArrayX: [1, 0],
    dashArrayY: [2, 12],
    rotation: 40,
  },
} satisfies BarSeriesOption['itemStyle'];
