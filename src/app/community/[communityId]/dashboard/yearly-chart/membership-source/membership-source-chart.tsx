import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import {
  EChart,
  pieSeriesStyle,
  type ECElementEvent,
  type EChartsOption,
  type EChartsType,
  type PieSeriesOption,
} from '~/view/base/echart';
import { usePageContext } from '../../page-context';

const MembershipSourceFragment = graphql(/* GraphQL */ `
  fragment Dashboard_MembershipSource on Community {
    communityStat {
      id
      memberSourceStat(year: $year) {
        eventName
        new
        renew
      }
    }
  }
`);

type MemberSourceStat =
  GQL.Dashboard_MembershipSourceFragment['communityStat']['memberSourceStat'][number];

class ChartDataHelper {
  #stat: MemberSourceStat[];

  constructor(stat: MemberSourceStat[]) {
    this.#stat = stat.filter((entry) => entry.new + entry.renew > 0);
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

  pieData(eventSelected?: string | null) {
    return this.#stat.map((entry, idx) => {
      const decalDataIndex =
        eventSelected != null ? this.toDataIndex(eventSelected) : null;
      return {
        value: entry.new + entry.renew,
        name: entry.eventName,
        ...pieSeriesStyle({
          showValue: true,
          isSelected: idx === decalDataIndex,
        }),
      };
    }) satisfies PieSeriesOption['data'];
  }

  pieDataLabel() {
    return this.#stat.map((entry) => {
      return {
        value: entry.new + entry.renew,
        name: entry.eventName,
        ...pieSeriesStyle({
          showCategory: true,
        }),
      };
    }) satisfies PieSeriesOption['data'];
  }
}

interface Props {
  className?: string;
}

export const MembershipSourceChart: React.FC<Props> = ({ className }) => {
  const { setEventSelected, eventSelected, community } = usePageContext();
  const entry = getFragment(MembershipSourceFragment, community);
  const communityStat = entry?.communityStat;

  const chartHelper = React.useMemo(() => {
    const helper = new ChartDataHelper(communityStat?.memberSourceStat ?? []);
    return helper;
  }, [communityStat]);

  const onPieSelect = React.useCallback(
    (evt: ECElementEvent, chartInst: EChartsType) => {
      const dataIndex = evt.dataIndexInside;
      const eventName = chartHelper.toEventName(dataIndex);
      if (eventName != null) {
        setEventSelected?.(eventName);
      }
    },
    [chartHelper, setEventSelected]
  );

  const option = React.useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: 0,
        itemStyle: {
          /**
           * The default pie label slice has opacity:0, make this 1 to make sure
           * it shows on screen
           */
          opacity: 1,
        },
      },
      series: [
        {
          name: 'label layer',
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['30%', '70%'],
          data: chartHelper.pieDataLabel(),
        },
        {
          name: 'membership source',
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['30%', '70%'],
          data: chartHelper.pieData(eventSelected),
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
      onEvents={{
        select: onPieSelect,
      }}
    />
  );
};
