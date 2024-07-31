import { ResponsivePie, type MayHaveLabel, type PieSvgProps } from '@nivo/pie';
import clsx from 'clsx';
import React from 'react';
import { COLOR_SCHEME } from '../item-color';
import { useNivoTheme } from '../theme';

export interface PieChartProps<T extends MayHaveLabel>
  extends Omit<PieSvgProps<T>, 'width' | 'height'> {
  className?: string;
}

export function PieChart<T extends MayHaveLabel>({
  className,
  ...props
}: PieChartProps<T>) {
  const theme = useNivoTheme();
  const margin = React.useMemo(() => {
    const result = {
      top: 25, // save space for pie labels
      right: 80, // save space for pie labels
      bottom: 80, // save space for legend
      left: 80, // save space for pie labels
    };
    return result;
  }, []);

  return (
    <div className={clsx(className)}>
      <ResponsivePie
        margin={margin}
        theme={theme}
        colors={{ scheme: COLOR_SCHEME }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        {...props}
      />
    </div>
  );
}
