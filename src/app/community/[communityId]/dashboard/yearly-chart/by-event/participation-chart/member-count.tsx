import { CardBody, cn } from '@heroui/react';
import React from 'react';
import { ChartDataHelperUtil } from '~/community/[communityId]/dashboard/chart-data-helper';
import { BarChart, getItemColor } from '~/view/base/chart';
import { type MemberSourceStat } from '../_type';

interface ChartDataEntry extends Record<string, string | number> {
  eventName: string;
  new: number;
  renewed: number;
  existing: number;
}

class ChartDataHelper extends ChartDataHelperUtil<ChartDataEntry> {
  public chartKeys = ['existing', 'renewed', 'new'];

  constructor(private stat: MemberSourceStat) {
    super();
    this.chartData = this.stat.map((entry) => ({
      eventName: entry.eventName,
      new: entry.new,
      renewed: entry.renew,
      existing: entry.existing,
    }));
  }

  xVal(entry: ChartDataEntry) {
    return entry.existing + entry.renewed + entry.new;
  }

  getDataColor(label: keyof ChartDataEntry) {
    const itemIdx = this.chartKeys.indexOf(label as string);
    if (itemIdx !== -1) {
      return getItemColor(itemIdx);
    }
    return getItemColor(0);
  }
}

interface Props {
  className?: string;
  stat: MemberSourceStat;
}

export const MemberCount: React.FC<Props> = ({ className, stat }) => {
  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(stat);
    return helper;
  }, [stat]);

  const { chartData } = chartHelper;

  const gridXValues = React.useMemo(
    () =>
      chartHelper.getIntegerTicks(
        10,
        (entry) => entry.existing + entry.new + entry.renewed
      ),
    [chartHelper]
  );

  return (
    <CardBody className={cn(className, 'h-[150px]')}>
      <BarChart
        data={chartData}
        keys={chartHelper.chartKeys}
        indexBy="eventName"
        layout="horizontal"
        margin={{
          top: 0,
          bottom: 80,
          left: 15,
          right: 50,
        }}
        gridXValues={gridXValues}
        axisLeft={null}
        axisBottom={{
          tickValues: gridXValues,
        }}
        enableTotals
        legendPos="bottom"
        layers={['grid', 'axes', 'bars', 'totals', 'markers', 'legends']}
      />
    </CardBody>
  );
};
