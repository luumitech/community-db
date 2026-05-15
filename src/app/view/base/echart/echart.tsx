import { EChartsOption, type EChartsType } from 'echarts';
import ReactECharts, { type EChartsReactProps } from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { useTheme } from 'next-themes';
import React from 'react';
import { useMeasure } from 'react-use';
import { twMerge } from 'tailwind-merge';
import { registerColumnClick, type OnColumnClickCB } from './bar-chart';
import { darkTheme, lightTheme } from './theme';

const THEME_PREFIX = 'cd-echart';
echarts.registerTheme(`${THEME_PREFIX}-light`, lightTheme);
echarts.registerTheme(`${THEME_PREFIX}-dark`, darkTheme);

interface Props<DataT = unknown> extends EChartsReactProps {
  className?: string;
  option: EChartsOption;
  onColumnClick?: OnColumnClickCB<DataT>;
}

export const EChart = React.forwardRef(
  <DataT,>(
    { className, onColumnClick, onChartReady, ...props }: Props<DataT>,
    ref: React.ForwardedRef<ReactECharts>
  ) => {
    const [divRef, { height, width }] = useMeasure<HTMLDivElement>();
    const { resolvedTheme: theme } = useTheme();

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
            theme={`${THEME_PREFIX}-${theme}`}
            onChartReady={customOnChartReady}
            {...props}
          />
        )}
      </div>
    );
  }
) as (<DataT = unknown>(
  props: Props<DataT> & { ref?: React.ForwardedRef<ReactECharts> }
) => React.ReactElement) & { displayName?: string };

EChart.displayName = 'EChart';
