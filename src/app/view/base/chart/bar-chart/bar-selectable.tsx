import { cn } from '@heroui/react';
import { BarCustomLayerProps, type BarDatum } from '@nivo/bar';
import React from 'react';
import { useTooltip } from '~/view/base/chart/tooltip';

interface BarSelectableOpt<T> {
  renderToolTip?: (data: T) => React.ReactNode;
  onDataClick?: (data: T) => void;
}

/**
 * Renders a transparent rectangle for the entire column, not just the colored
 * section. This way, you can hover over the column to see tooltip and also
 * select the column by clicking anywhere on it.
 *
 * @param chartData - Data to render
 * @param opt - Additional options on configuring the bar rendering
 * @returns Custom layer component for stacked bar chart
 */
export function barSelectable<T = BarDatum>(
  chartData: T[],
  opt?: BarSelectableOpt<T>
) {
  const Bar: React.FC<BarCustomLayerProps<T>> = ({ bars, innerHeight }) => {
    const tip = useTooltip();

    const { renderToolTip, onDataClick } = opt ?? {};
    // Render the bars normally (without selected pattern overlay)
    const barRects = bars.map((bar) => {
      return (
        <svg
          key={bar.key}
          x={bar.x}
          y={0}
          width={bar.width}
          height={innerHeight}
        >
          <rect
            width="100%"
            height="100%"
            className={cn('fill-transparent')}
            {...(renderToolTip != null && {
              onMouseEnter: (evt) =>
                tip.showTooltipFromEvent(renderToolTip(bar.data.data), evt),
              onMouseMove: (evt) =>
                tip.showTooltipFromEvent(renderToolTip(bar.data.data), evt),
              onMouseLeave: tip.hideTooltip,
            })}
            onClick={() => onDataClick?.(bar.data.data)}
          />
        </svg>
      );
    });

    return <>{barRects}</>;
  };
  return Bar;
}
