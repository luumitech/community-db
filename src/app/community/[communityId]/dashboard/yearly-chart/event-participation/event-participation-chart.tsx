import type { BarSeriesOption } from 'echarts';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import {
  EChart,
  barLabel,
  barSelectedStyle,
  type EChartsOption,
  type OnColumnClickCB,
} from '~/view/base/echart';
import { usePageContext } from '../../page-context';

const EventFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventParticipation on Community {
    communityStat {
      id
      memberSourceStat(year: $year) {
        eventName
        new
        renew
        existing
      }
    }
  }
`);

type MemberSourceStat =
  GQL.Dashboard_EventParticipationFragment['communityStat']['memberSourceStat'][number];

class ChartDataHelper {
  #stat: MemberSourceStat[];

  constructor(stat: MemberSourceStat[]) {
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

  xAxisData() {
    return this.#stat.map((entry) => entry.eventName);
  }

  values(
    key: 'renew' | 'new' | 'existing',
    eventNameToAddDecal?: string | null
  ) {
    const decalDataIndex =
      eventNameToAddDecal != null
        ? this.toDataIndex(eventNameToAddDecal)
        : null;
    return this.#stat.map((entry, idx) => ({
      value: entry[key],
      ...(idx === decalDataIndex && { itemStyle: barSelectedStyle }),
    }));
  }

  totalBar(): BarSeriesOption {
    return {
      data: this.#totalBarData(),
      label: this.#totalBarLabel(),
      tooltip: {
        valueFormatter: (value, dataIndex) => `${this.#totalValue(dataIndex)}`,
      },
    };
  }

  #totalValue(dataIndex: number) {
    const entry = this.#stat[dataIndex];
    if (entry != null) {
      return entry.existing + entry.new + entry.renew;
    } else {
      return 0;
    }
  }

  #totalBarData() {
    return this.#stat.map(() => ({
      value: 6,
      itemStyle: {
        color: 'transparent',
      },
    })) satisfies BarSeriesOption['data'];
  }

  #totalBarLabel() {
    return {
      show: true,
      position: 'insideBottom',
      fontSize: 10,
      color: 'black',
      fontWeight: 'bold',
      formatter: (params) => {
        const { dataIndex } = params;
        const total = this.#totalValue(dataIndex);
        return total === 0 ? 'n/a' : `${total}`;
      },
    } satisfies BarSeriesOption['label'];
  }
}

interface Props {
  className?: string;
}

export const EventParticipationChart: React.FC<Props> = ({ className }) => {
  const { setEventSelected, eventSelected, community } = usePageContext();
  const entry = getFragment(EventFragment, community);
  const communityStat = entry?.communityStat;

  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(communityStat?.memberSourceStat ?? []);
    return helper;
  }, [communityStat]);

  const onColumnClick = React.useCallback<OnColumnClickCB>(
    (chartInst, dataIndex) => {
      const eventName = chartHelper.toEventName(dataIndex);
      if (eventName != null) {
        setEventSelected?.(eventName);
      }
    },
    [chartHelper, setEventSelected]
  );

  const option = React.useMemo<EChartsOption>(() => {
    return {
      grid: {
        bottom: 100,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: 0,
        data: [{ name: 'new' }, { name: 'renewed' }, { name: 'existing' }],
      },
      xAxis: {
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
        data: chartHelper.xAxisData(),
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
          name: 'existing',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('existing', eventSelected),
          label: barLabel,
        },
        {
          name: 'renewed',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('renew', eventSelected),
          label: barLabel,
        },
        {
          name: 'new',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('new', eventSelected),
          label: barLabel,
        },

        {
          name: 'total',
          type: 'bar',
          stack: 'members',
          ...chartHelper.totalBar(),
        },
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
