import { EChartsOption, type EChartsType } from 'echarts';
import ReactECharts, { type EChartsReactProps } from 'echarts-for-react';
import * as echarts from 'echarts/core';
import React from 'react';
import { useMeasure } from 'react-use';
import { twMerge } from 'tailwind-merge';
import { registerColumnClick, type OnColumnClickCB } from './grid-util';
import themeObj from './theme.json';

echarts.registerTheme('default-theme', themeObj);

interface Props extends EChartsReactProps {
  className?: string;
  option: EChartsOption;
  onColumnClick?: OnColumnClickCB;
}

export const EChart = React.forwardRef<ReactECharts, Props>(
  ({ className, onColumnClick, onChartReady, ...props }, ref) => {
    const [divRef, { height, width }] = useMeasure<HTMLDivElement>();

    const customOnChartReady = React.useCallback(
      (chartInst: EChartsType) => {
        if (onColumnClick) {
          registerColumnClick(chartInst, onColumnClick);
        }
        onChartReady?.(chartInst);
      },
      [onChartReady, onColumnClick]
    );

    return (
      <div ref={divRef} className={twMerge('h-full w-full', className)}>
        {width > 0 && height > 0 && (
          <ReactECharts
            ref={ref}
            style={{ width, height }}
            theme={'default-theme'}
            onChartReady={customOnChartReady}
            {...props}
          />
        )}
      </div>
    );
  }
);

EChart.displayName = 'EChart';
