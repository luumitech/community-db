import { cn } from '@heroui/react';
import {
  ResponsiveBar,
  type BarDatum,
  type BarLegendProps,
  type ResponsiveBarSvgProps,
} from '@nivo/bar';
import React from 'react';
import { COLOR_SCHEME } from '../item-color';
import { useNivoTheme } from '../theme';

export interface BarChartProps<T extends BarDatum>
  extends ResponsiveBarSvgProps<T> {
  className?: string;
  legendPos?: 'bottom-right' | 'bottom';
  legendProp?: Partial<BarLegendProps>;
  onDataClick?: (datum: T) => void;
}

export function BarChart<T extends BarDatum>({
  className,
  margin,
  axisLeft,
  axisBottom,
  legendPos = 'bottom-right',
  legendProp,
  onClick,
  onDataClick,
  ...props
}: BarChartProps<T>) {
  const theme = useNivoTheme();

  const actualMargin = React.useMemo(() => {
    const result = {
      top: props.enableTotals ? 20 : 0,
      right: 0,
      bottom: 50, // save space for under x-axis
      left: 60, // save space for left of y-axis
    };
    switch (legendPos) {
      case 'bottom-right':
        result.right = 130;
        break;
      case 'bottom':
        result.bottom = 90;
        break;
    }
    return {
      ...result,
      ...margin,
    };
  }, [props.enableTotals, legendPos, margin]);

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
    <div className={cn(className, 'h-full')}>
      <ResponsiveBar
        onClick={customOnClick}
        theme={theme}
        margin={actualMargin}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: COLOR_SCHEME }}
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
            ...legendProp,
          },
        ]}
        {...props}
      />
    </div>
  );
}
