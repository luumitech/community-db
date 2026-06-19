import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/types';
import {
  EChart,
  TotalUtil,
  barStyle,
  useEChartTheme,
  type BarSeriesOption,
  type EChartTheme,
  type EChartsOption,
  type OnColumnClickCB,
} from '~/view/base/echart';
import { usePageContext } from '../../page-context';

const EventFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventParticipation on Community {
    communityStat {
      id
      byEventStat(year: $year) {
        eventName
        new
        renew
        existing
        nonMember
      }
    }
  }
`);

type ByEventStat =
  GQL.Dashboard_EventParticipationFragment['communityStat']['byEventStat'][number];

class ChartDataHelper {
  #theme: EChartTheme;
  #stat: ByEventStat[];

  constructor(theme: EChartTheme, stat: ByEventStat[]) {
    this.#theme = theme;
    this.#stat = stat;
  }

  toEventName(dataIndex: number) {
    if (dataIndex < this.#stat.length) {
      return this.#stat[dataIndex].eventName;
    }
    return null;
  }

  toDataIndex(eventNameInput: string) {
    const dataIndex = this.#stat.findIndex(
      ({ eventName }) => eventName === eventNameInput
    );
    return dataIndex === -1 ? null : dataIndex;
  }

  categories() {
    return this.#stat.map((entry) => entry.eventName);
  }

  barSeries(
    key: 'renew' | 'new' | 'existing' | 'nonMember',
    name: string,
    eventSelected?: string | null
  ): BarSeriesOption {
    const decalDataIndex =
      eventSelected != null ? this.toDataIndex(eventSelected) : null;
    const data = this.#stat.map((entry, idx) => ({
      value: entry[key],
      ...barStyle(this.#theme, { isSelected: idx === decalDataIndex }),
    })) satisfies BarSeriesOption['data'];

    return {
      name,
      type: 'bar',
      stack: 'members',
      data,
    };
  }

  totalBarSeries(): BarSeriesOption {
    const totalUtil = new TotalUtil(this.#theme, {
      categoryNum: this.#stat.length,
      totalFn: (dataIndex) => {
        const entry = this.#stat[dataIndex];
        if (entry != null) {
          return entry.existing + entry.new + entry.renew + entry.nonMember;
        } else {
          return 0;
        }
      },
    });

    return {
      name: 'total',
      type: 'bar',
      stack: 'members',
      ...totalUtil.totalBar('top'),
    };
  }
}

interface Props {
  className?: string;
}

export const EventParticipationChart: React.FC<Props> = ({ className }) => {
  const { setEventSelected, eventSelected, community } = usePageContext();
  const theme = useEChartTheme();
  const entry = getFragment(EventFragment, community);
  const communityStat = entry?.communityStat;

  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(theme, communityStat?.byEventStat ?? []);
    return helper;
  }, [theme, communityStat]);

  const onColumnClick = React.useCallback<OnColumnClickCB<string>>(
    (chartInst, data, dataIndex) => {
      const eventName = data[dataIndex];
      if (eventName != null) {
        setEventSelected?.(eventName);
      }
    },
    [setEventSelected]
  );

  const option = React.useMemo<EChartsOption>(() => {
    return {
      grid: {
        // Add a little room in case the total label is outside the graph
        top: 15,
        // Reserve enough space for the x-axis label
        bottom: 100,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
        data: [
          { name: 'new' },
          { name: 'renewed' },
          { name: 'existing' },
          { name: 'non-member' },
        ],
      },
      xAxis: {
        type: 'category',
        name: 'Event',
        nameLocation: 'middle',
        nameGap: 10,
        axisTick: {
          show: true,
          alignWithLabel: true,
        },
        axisLabel: {
          interval: 0,
          rotate: 20,
          width: 80,
          overflow: 'truncate',
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
        chartHelper.barSeries('existing', 'existing', eventSelected),
        chartHelper.barSeries('renew', 'renewed', eventSelected),
        chartHelper.barSeries('new', 'new', eventSelected),
        chartHelper.barSeries('nonMember', 'non-member', eventSelected),
        chartHelper.totalBarSeries(),
      ],
    };
  }, [chartHelper, eventSelected]);

  if (communityStat == null) {
    return null;
  }

  return (
    <EChart
      className={className}
      option={option}
      onColumnClick={onColumnClick}
    />
  );
};
