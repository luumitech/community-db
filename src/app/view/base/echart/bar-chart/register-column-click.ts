import type { EChartsType, ElementEvent } from 'echarts';

export type OnColumnClickCB = (
  chartInst: EChartsType,
  dataIndex: number
) => void;

/**
 * Install a click listener to the grid type charts:
 *
 * - Bar
 * - Line
 * - Scatter
 * - Candlestick
 *
 * And invoke the cb whenever mouse is click on the column where the bar lies
 *
 * @param chartInst Echarts instance
 * @param cb Callback when a column is click (anywhere on the column where the
 *   bar lies)
 */
export function registerColumnClick(
  chartInst: EChartsType,
  cb: OnColumnClickCB
) {
  const zr = chartInst.getZr();

  // Remove existing listeners to avoid duplicates on re-renders
  zr.off('click');

  zr.on('click', (params: ElementEvent) => {
    const pointInPixel = [params.offsetX, params.offsetY];

    // Check if click is within the grid area
    if (chartInst.containPixel('grid', pointInPixel)) {
      // Convert pixels to data index
      const pointInGrid = chartInst.convertFromPixel('grid', pointInPixel);
      const dataIndex = pointInGrid[0];
      cb(chartInst, dataIndex);
    }
  });
}
