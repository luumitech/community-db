import {
  ResponsiveBar,
  type BarDatum,
  type ResponsiveBarSvgProps,
} from '@nivo/bar';
import { useMeasure } from '@uidotdev/usehooks';
import clsx from 'clsx';
import React from 'react';
import { useNivoTheme } from '../theme';

export interface BarChartProps<T extends BarDatum>
  extends ResponsiveBarSvgProps<T> {
  className?: string;
  legendPos?: 'bottom-right' | 'bottom';
  onDataClick?: (datum: T) => void;
}

export function BarChart<T extends BarDatum>({
  className,
  axisLeft,
  axisBottom,
  legendPos = 'bottom-right',
  onClick,
  onDataClick,
  ...props
}: BarChartProps<T>) {
  const theme = useNivoTheme();
  const [ref, divMeasure] = useMeasure();

  const margin = React.useMemo(() => {
    const result = {
      top: props.enableTotals ? 20 : 0,
      right: 0,
      bottom: 50, // save space for x-axis label
      left: 60, // save space for y-axis label
    };
    switch (legendPos) {
      case 'bottom-right':
        result.right = 130;
        break;
      case 'bottom':
        result.bottom = 90;
        break;
    }
    return result;
  }, [props.enableTotals, legendPos]);

  const graphWidth = React.useMemo(() => {
    return divMeasure.width ?? 0 - margin.left - margin.right;
  }, [divMeasure, margin]);

  const customOnClick = React.useCallback<
    NonNullable<ResponsiveBarSvgProps<T>['onClick']>
  >(
    (item, evt) => {
      onClick?.(item, evt);
      onDataClick?.(item.data);
    },
    [onClick, onDataClick]
  );

  return (
    <div ref={ref} className={clsx(className)}>
      <ResponsiveBar
        onClick={customOnClick}
        theme={theme}
        margin={margin}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'pastel1' }}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Event',
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0,
          ...axisBottom,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0,
          ...axisLeft,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: 'color',
          modifiers: [['darker', 1.6]],
        }}
        legends={[
          {
            dataFrom: 'keys',
            justify: false,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
            anchor: 'bottom-right',
            direction: 'column',
            ...(legendPos === 'bottom-right' && {
              anchor: 'bottom-right',
              direction: 'column',
              translateX: 120,
              translateY: 0,
            }),
            ...(legendPos === 'bottom' && {
              anchor: 'bottom',
              direction: 'row',
              translateX: 0,
              translateY: 70,
              itemWidth: 70,
            }),
          },
        ]}
        {...props}
      />
    </div>
  );
}
