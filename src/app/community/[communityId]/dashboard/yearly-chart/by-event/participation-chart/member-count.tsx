import { CardBody, cn } from '@heroui/react';
import React from 'react';
import { ChartDataHelperUtil } from '~/community/[communityId]/dashboard/chart-data-helper';
import { BarChart, barTotal, getItemColor } from '~/view/base/chart';
import { type MemberSourceStat } from '../_type';

interface ChartDataEntry extends Record<string, string | number> {
  year: number;
  new: number;
  renewed: number;
  existing: number;
}

class ChartDataHelper extends ChartDataHelperUtil<ChartDataEntry> {
  public chartKeys = ['existing', 'renewed', 'new'];

  constructor(
    private year: number,
    private yearStat: MemberSourceStat,
    private prevYearStat: MemberSourceStat
  ) {
    super();
    this.chartData = [
      {
        year,
        new: yearStat[0].new,
        renewed: yearStat[0].renew,
        existing: yearStat[0].existing,
      },
      {
        year: year - 1,
        new: prevYearStat[0]?.new ?? 0,
        renewed: prevYearStat[0]?.renew ?? 0,
        existing: prevYearStat[0]?.existing ?? 0,
      },
    ];
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
  year: number;
  yearStat: MemberSourceStat;
  prevYearStat: MemberSourceStat;
}

export const MemberCount: React.FC<Props> = ({
  className,
  year,
  yearStat,
  prevYearStat,
}) => {
  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(year, yearStat, prevYearStat);
    return helper;
  }, [year, yearStat, prevYearStat]);

  const { chartData } = chartHelper;

  const gridXValues = React.useMemo(
    () =>
      chartHelper.getIntegerTicks(
        10,
        (entry) => entry.existing + entry.new + entry.renewed
      ),
    [chartHelper]
  );

  const CustomTotals = React.useMemo(() => {
    return barTotal(chartData, 'horizontal');
  }, [chartData]);

  return (
    <CardBody className={cn(className, 'h-[150px]')}>
      <BarChart
        data={chartData}
        keys={chartHelper.chartKeys}
        indexBy="year"
        layout="horizontal"
        margin={{
          top: 0,
          bottom: 40,
          left: 35,
          right: 50,
        }}
        gridXValues={gridXValues}
        enableGridY={false}
        // axisLeft={null}
        axisBottom={null}
        // enableTotals
        legends={[
          {
            dataFrom: 'keys',
            justify: false,
            itemsSpacing: 2,
            itemWidth: 80,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            symbolSize: 20,
            direction: 'row',
            anchor: 'bottom',
            translateX: 0,
            translateY: 30,
          },
        ]}
        layers={[
          'grid',
          'axes',
          'bars',
          // 'totals',
          CustomTotals,
          'markers',
          'legends',
        ]}
      />
    </CardBody>
  );
};
