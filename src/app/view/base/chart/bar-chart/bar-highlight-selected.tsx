import { BarCustomLayerProps, type BarDatum } from '@nivo/bar';
import React from 'react';
import * as R from 'remeda';
import { useTooltip } from '~/view/base/chart/tooltip';

/**
 * Render stacked bar chart with pattern overlay on selected bar
 *
 * @param chartData - Data to render
 * @param selectedIndexValue - Index value of the selected bar
 * @returns Custom layer component for stacked bar chart
 */
export function barHighlightSelected<T extends BarDatum>(
  chartData: T[],
  selectedIndexValue?: string | number | null
) {
  const Bar: React.FC<BarCustomLayerProps<T>> = ({ bars }) => {
    const tip = useTooltip();
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
            className="fill-[rgb(79,109,140)] font-sans text-[11px]"
          >
            {bar.data.formattedValue}
          </text>
        </svg>
      );
    });

    // Render the selected bar with pattern overlay
    let selectedSvg = null;
    const selectedBars = bars.filter(
      (bar) => selectedIndexValue === bar.data.indexValue
    );
    if (selectedBars.length) {
      const x = selectedBars[0].x;
      const y = Math.min(...selectedBars.map((bar) => bar.y));
      const width = selectedBars[0].width;
      const height = R.sum(selectedBars.map((bar) => bar.height));
      const patternId = `pattern_${selectedBars[0].key}`.replace(/ /g, '');
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
