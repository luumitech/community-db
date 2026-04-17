import { CardBody, cn } from '@heroui/react';
import React from 'react';
import {
  EChart,
  TotalUtil,
  barStyle,
  type BarSeriesOption,
  type EChartsOption,
} from '~/view/base/echart';
import { type MemberSourceStat } from '../_type';

class ChartDataHelper {
  #year: number;
  #yearStat: MemberSourceStat | null;
  #prevYearStat: MemberSourceStat | null;

  constructor(
    year: number,
    yearStat: MemberSourceStat | null,
    prevYearStat: MemberSourceStat | null
  ) {
    this.#year = year;
    this.#yearStat = yearStat;
    this.#prevYearStat = prevYearStat;
  }

  categories() {
    return [this.#year, this.#year - 1];
  }

  barData(key: 'renew' | 'new' | 'existing') {
    const curValue = this.#yearStat?.[key] ?? 0;
    const prevValue = this.#prevYearStat?.[key] ?? 0;
    return [
      { value: curValue, ...barStyle() },
      { value: prevValue, ...barStyle() },
    ] satisfies BarSeriesOption['data'];
  }

  totalBar() {
    const totalUtil = new TotalUtil({
      categoryNum: 2,
      totalFn: (dataIndex) => {
        const entry = dataIndex === 0 ? this.#yearStat : this.#prevYearStat;
        if (entry != null) {
          return entry.existing + entry.new + entry.renew;
        } else {
          return 0;
        }
      },
    });
    return totalUtil.totalBar('insideLeft');
  }
}

interface Props {
  className?: string;
  year: number;
  yearStat: MemberSourceStat | null;
  prevYearStat: MemberSourceStat | null;
}

export const MemberCountChart: React.FC<Props> = ({
  className,
  year,
  yearStat,
  prevYearStat,
}) => {
  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(year, yearStat, prevYearStat);
    return helper;
  }, [year, yearStat, prevYearStat]);

  const option = React.useMemo<EChartsOption>(() => {
    return {
      grid: {
        bottom: 40,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
        data: [{ name: 'new' }, { name: 'renewed' }, { name: 'existing' }],
      },
      xAxis: {
        type: 'value',
        show: false,
      },
      yAxis: {
        type: 'category',
        data: chartHelper.categories(),
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
      },
      series: [
        {
          name: 'existing',
          type: 'bar',
          stack: 'members',
          data: chartHelper.barData('existing'),
        },
        {
          name: 'renewed',
          type: 'bar',
          stack: 'members',
          data: chartHelper.barData('renew'),
        },
        {
          name: 'new',
          type: 'bar',
          stack: 'members',
          data: chartHelper.barData('new'),
        },
        {
          name: 'total',
          type: 'bar',
          stack: 'members',
          ...chartHelper.totalBar(),
        },
      ],
    };
  }, [chartHelper]);

  return (
    <CardBody className={cn(className, 'h-[150px]')}>
      <EChart className={className} option={option} />
    </CardBody>
  );
};
