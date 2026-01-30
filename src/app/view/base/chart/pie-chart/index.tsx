import { type LegendProps } from '@nivo/legends';
import {
  ResponsivePie,
  type DefaultRawDatum,
  type MayHaveLabel,
  type PieSvgProps,
} from '@nivo/pie';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { COLOR_SCHEME, getItemColor } from '../item-color';
import { useNivoTheme } from '../theme';

type DataT = DefaultRawDatum & MayHaveLabel;

const LEGEND_ITEM_HEIGHT = 18;
const LEGEND_ITEM_PER_ROW = 3;
const LEGEND_ITEM_GAP_Y = 5;

export interface PieChartProps<T extends DataT> extends Omit<
  PieSvgProps<T>,
  'width' | 'height'
> {
  className?: string;
}

export function PieChart<T extends DataT>({
  className,
  ...props
}: PieChartProps<T>) {
  const theme = useNivoTheme();
  const margin = React.useMemo(() => {
    const legendRowCount = Math.ceil(props.data.length / LEGEND_ITEM_PER_ROW);
    const result = {
      top: 25, // save space for pie labels
      right: 80, // save space for pie labels
      // save space for legend
      bottom: 50 + legendRowCount * (LEGEND_ITEM_HEIGHT + LEGEND_ITEM_GAP_Y),
      left: 80, // save space for pie labels
    };
    return result;
  }, [props.data]);

  /**
   * If there are too many slices, they can't all fit on one row. So split them
   * up to multiple rows and render the legends accordingly
   */
  const customLegend = React.useCallback(
    (dataList: readonly T[], chunkSize: number): LegendProps[] => {
      const legendProps: LegendProps = {
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 0,
        itemsSpacing: 0,
        itemWidth: 100,
        itemHeight: LEGEND_ITEM_HEIGHT,
        itemDirection: 'left-to-right',
        itemOpacity: 1,
        symbolSize: LEGEND_ITEM_HEIGHT,
        symbolShape: 'circle',
        effects: [
          {
            on: 'hover',
            style: { itemOpacity: 1 },
          },
        ],
      };

      const truncate = (text: string, max = 10) =>
        text.length > max ? text.slice(0, max) + '…' : text;

      const dataChunk = R.chunk(dataList, chunkSize);
      return dataChunk.map((chunk, chunkIdx) => {
        return {
          ...legendProps,
          translateY: 50 + chunkIdx * (LEGEND_ITEM_HEIGHT + LEGEND_ITEM_GAP_Y),
          data: (chunk as T[]).map((dataEntry, dataIdx) => ({
            ...dataEntry,
            label: truncate(dataEntry.label?.toString() ?? ''),
            color: getItemColor(chunkIdx * chunkSize + dataIdx),
          })),
        };
      });
    },
    []
  );

  return (
    <div className={twMerge('h-full', className)}>
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
        legends={customLegend(props.data, LEGEND_ITEM_PER_ROW)}
        {...props}
      />
    </div>
  );
}
