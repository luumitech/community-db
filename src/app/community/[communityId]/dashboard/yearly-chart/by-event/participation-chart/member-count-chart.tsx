import { CardBody, cn } from '@heroui/react';
import React from 'react';
import {
  EChart,
  TotalUtil,
  barStyle,
  useEChartTheme,
  type BarSeriesOption,
  type EChartTheme,
  type EChartsOption,
} from '~/view/base/echart';
import { type MemberSourceStat } from '../_type';

class ChartDataHelper {
  #theme: EChartTheme;
  #year: number;
  #yearStat: MemberSourceStat | null;
  #prevYearStat: MemberSourceStat | null;

  constructor(
    theme: EChartTheme,
    year: number,
    yearStat: MemberSourceStat | null,
    prevYearStat: MemberSourceStat | null
  ) {
    this.#theme = theme;
    this.#year = year;
    this.#yearStat = yearStat;
    this.#prevYearStat = prevYearStat;
  }

  categories() {
    return [this.#year, this.#year - 1];
  }

  barSeries(key: 'renew' | 'new' | 'existing', name: string): BarSeriesOption {
    const curValue = this.#yearStat?.[key] ?? 0;
    const prevValue = this.#prevYearStat?.[key] ?? 0;
    const data = [
      { value: curValue, ...barStyle(this.#theme) },
      { value: prevValue, ...barStyle(this.#theme) },
    ] satisfies BarSeriesOption['data'];

    return {
      name,
      type: 'bar',
      stack: 'members',
      data,
    };
  }

  totalBarSeries(): BarSeriesOption {
    const totalUtil = new TotalUtil(this.#theme, {
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

    return {
      name: 'total',
      type: 'bar',
      stack: 'members',
      ...totalUtil.totalBar('insideLeft'),
    };
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
  const theme = useEChartTheme();

  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(theme, year, yearStat, prevYearStat);
    return helper;
  }, [theme, year, yearStat, prevYearStat]);

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
        chartHelper.barSeries('existing', 'existing'),
        chartHelper.barSeries('renew', 'renewed'),
        chartHelper.barSeries('new', 'new'),
        chartHelper.totalBarSeries(),
      ],
    };
  }, [chartHelper]);

  return (
    <CardBody className={cn(className, 'h-[150px]')}>
      <EChart className={className} option={option} />
    </CardBody>
  );
};
