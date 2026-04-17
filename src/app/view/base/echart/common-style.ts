import type { BarSeriesOption, PieSeriesOption } from 'echarts';

const label = {
  show: true,
  color: 'rgb(79,109,140)',
  fontSize: 11,
  fontFamily: 'sans-serif',
} satisfies BarSeriesOption['label'] & PieSeriesOption['label'];

const selectedItemStyle = {
  decal: {
    symbol: 'rect',
    color: 'rgba(255,255,255,0.8)',
    dashArrayX: [1, 0],
    dashArrayY: [2, 12],
    rotation: 40,
  },
} satisfies BarSeriesOption['itemStyle'] & PieSeriesOption['itemStyle'];

export const defaultStyle = {
  label,
  selectedItemStyle,
};
