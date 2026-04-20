import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import {
  EChart,
  barStyle,
  useEChartTheme,
  type BarSeriesOption,
  type EChartTheme,
  type EChartsOption,
  type LineSeriesOption,
  type OnColumnClickCB,
  type ReactECharts,
} from '~/view/base/echart';
import { type MemberCountEntry } from './_type';

const MemberCountFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MemberCount on Community {
    communityStat {
      id
      memberCountStat {
        year
        renew
        new
        noRenewal
      }
    }
  }
`);

type ByYearStat =
  GQL.Dashboard_MemberCountFragment['communityStat']['memberCountStat'][number];

class ChartDataHelper {
  #theme: EChartTheme;
  #stat: ByYearStat[];

  constructor(theme: EChartTheme, stat: ByYearStat[], yearRange: number) {
    this.#theme = theme;
    if (yearRange > 0) {
      this.#stat = stat.slice(-yearRange);
    } else {
      this.#stat = stat;
    }
  }

  toYear(dataIndex: number) {
    if (dataIndex < this.#stat.length) {
      return this.#stat[dataIndex].year;
    }
    return null;
  }

  toDataIndex(yearInput: number) {
    const dataIndex = this.#stat.findIndex(({ year }) => year === yearInput);
    return dataIndex === -1 ? null : dataIndex;
  }

  categories() {
    return this.#stat.map((entry) => entry.year);
  }

  barSeries(
    key: 'renew' | 'new',
    name: string,
    selectedYear?: number | null
  ): BarSeriesOption {
    const decalDataIndex =
      selectedYear != null ? this.toDataIndex(selectedYear) : null;
    const data = this.#stat.map((entry, idx) => ({
      value: entry[key],
      ...barStyle(this.#theme, {
        isSelected: idx === decalDataIndex,
      }),
    })) satisfies BarSeriesOption['data'];

    return {
      name,
      type: 'bar',
      stack: 'members',
      data,
    };
  }

  lineSeries(key: 'noRenewal', name: string): LineSeriesOption {
    const data = this.#stat.map((entry) => ({
      value: entry[key],
    })) satisfies LineSeriesOption['data'];

    return {
      name,
      type: 'line',
      data,
    };
  }
}

interface Props {
  className?: string;
  fragment?: MemberCountEntry;
  yearRange: number;
  selectedYear?: number | null;
  onYearSelect?: (year: number) => void;
}

export const MemberCountBarChart: React.FC<Props> = ({
  className,
  fragment,
  yearRange,
  selectedYear,
  onYearSelect,
}) => {
  const chartRef = React.useRef<ReactECharts>(null);
  const theme = useEChartTheme();
  const entry = getFragment(MemberCountFragment, fragment);
  const communityStat = entry?.communityStat;

  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(
      theme,
      communityStat?.memberCountStat ?? [],
      yearRange
    );
    return helper;
  }, [theme, communityStat, yearRange]);

  const onColumnClick = React.useCallback<OnColumnClickCB>(
    (chartInst, dataIndex) => {
      const year = chartHelper.toYear(dataIndex);
      if (year != null) {
        onYearSelect?.(year);
      }
    },
    [chartHelper, onYearSelect]
  );

  const option = React.useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
        data: [{ name: 'new' }, { name: 'renewed' }, { name: 'no renewal' }],
      },
      xAxis: {
        name: 'Year',
        nameLocation: 'middle',
        nameGap: 10,
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
        data: chartHelper.categories(),
      },
      yAxis: {
        type: 'value',
        name: 'Member Count',
        nameLocation: 'middle',
        nameGap: 10,
        minInterval: 1,
      },
      series: [
        chartHelper.lineSeries('noRenewal', 'no renewal'),
        chartHelper.barSeries('renew', 'renewed', selectedYear),
        chartHelper.barSeries('new', 'new', selectedYear),
      ],
    };
  }, [chartHelper, selectedYear]);

  if (communityStat == null) {
    return null;
  }

  return (
    <EChart
      ref={chartRef}
      className={className}
      option={option}
      onColumnClick={onColumnClick}
    />
  );
};
