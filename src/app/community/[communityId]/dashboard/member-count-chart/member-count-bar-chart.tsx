import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import {
  EChart,
  barSeriesLabel,
  barSeriesSelectedItemStyle,
  type EChartsOption,
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
  #stat: ByYearStat[];

  constructor(stat: ByYearStat[], yearRange: number) {
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

  values(key: 'renew' | 'new' | 'noRenewal', yearToAddDecal?: number | null) {
    const decalDataIndex =
      yearToAddDecal != null ? this.toDataIndex(yearToAddDecal) : null;
    return this.#stat.map((entry, idx) => ({
      value: entry[key],
      ...(idx === decalDataIndex && { itemStyle: barSeriesSelectedItemStyle }),
    }));
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
  const entry = getFragment(MemberCountFragment, fragment);
  const communityStat = entry?.communityStat;

  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(
      communityStat?.memberCountStat ?? [],
      yearRange
    );
    return helper;
  }, [communityStat, yearRange]);

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
        {
          name: 'no renewal',
          type: 'line',
          data: chartHelper.values('noRenewal', selectedYear),
        },
        {
          name: 'renewed',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('renew', selectedYear),
          label: barSeriesLabel,
        },
        {
          name: 'new',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('new', selectedYear),
          label: barSeriesLabel,
        },
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
