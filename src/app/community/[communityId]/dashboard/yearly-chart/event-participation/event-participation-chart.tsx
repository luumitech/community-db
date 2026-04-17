import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import {
  EChart,
  TotalUtil,
  barSeriesLabel,
  barSeriesSelectedItemStyle,
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

  categories() {
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
      ...(idx === decalDataIndex && { itemStyle: barSeriesSelectedItemStyle }),
    }));
  }

  totalBar() {
    const totalUtil = new TotalUtil({
      categoryNum: this.#stat.length,
      totalFn: (dataIndex) => {
        const entry = this.#stat[dataIndex];
        if (entry != null) {
          return entry.existing + entry.new + entry.renew;
        } else {
          return 0;
        }
      },
    });
    return totalUtil.totalBar('top');
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
        data: [{ name: 'new' }, { name: 'renewed' }, { name: 'existing' }],
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
        {
          name: 'existing',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('existing', eventSelected),
          label: barSeriesLabel,
        },
        {
          name: 'renewed',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('renew', eventSelected),
          label: barSeriesLabel,
        },
        {
          name: 'new',
          type: 'bar',
          stack: 'members',
          data: chartHelper.values('new', eventSelected),
          label: barSeriesLabel,
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
