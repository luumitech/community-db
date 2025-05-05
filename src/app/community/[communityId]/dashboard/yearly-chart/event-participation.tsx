import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Skeleton,
  cn,
} from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import {
  BarChart,
  barHighlightSelected,
  barSelectable,
  getItemColor,
} from '~/view/base/chart';
import { TableTooltip } from '~/view/base/chart/tooltip';
import { ChartDataHelperUtil } from '../chart-data-helper';
import { type DashboardEntry } from './_type';
import { useYearlyContext } from './yearly-context';

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
  GQL.Dashboard_EventParticipationFragment['communityStat']['memberSourceStat'];

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

  yVal(entry: ChartDataEntry) {
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

/** Custom tool tip when hovering over bars */
function customTooltip(helper: ChartDataHelper) {
  // const Tooltip: React.FC<BarTooltipProps<ChartDataEntry>> = ({ data }) => {
  const Tooltip: React.FC<{ data: ChartDataEntry }> = ({ data }) => {
    const dataValue = React.useCallback(
      (labelKey: keyof ChartDataEntry) => {
        const entry = helper.chartData.find(
          ({ eventName }) => eventName === data.eventName
        );
        return (entry?.[labelKey as keyof typeof entry] as number) ?? 0;
      },
      [data]
    );

    const row = React.useCallback(
      (symbol: 'bar' | 'none', label: string, value: number) => {
        const itemColor = helper.getDataColor(label);
        const firstCol = (
          <span
            className={cn('block w-3 mt-[3px]', symbol === 'bar' && 'h-3')}
            style={{ backgroundColor: itemColor }}
          />
        );
        return [firstCol, label, <strong key="col-3">{value}</strong>];
      },
      []
    );

    return (
      <TableTooltip
        title={<strong>{dataValue('eventName')}</strong>}
        rows={[
          row('bar', 'existing', dataValue('existing')),
          row('bar', 'renewed', dataValue('renewed')),
          row('bar', 'new', dataValue('new')),
          [<Divider key="divider" />],
          row(
            'none',
            'total',
            dataValue('existing') + dataValue('new') + dataValue('renewed')
          ),
        ]}
      />
    );
  };
  return Tooltip;
}

interface Props {
  className?: string;
  fragment?: DashboardEntry;
  year: number;
  isLoading?: boolean;
}

export const EventParticipation: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
  const { setEventSelected, eventSelected } = useYearlyContext();
  const entry = getFragment(EventFragment, fragment);

  const chartHelper = React.useMemo(() => {
    const memberSourceStat = entry?.communityStat.memberSourceStat ?? [];
    const helper = new ChartDataHelper(memberSourceStat);
    return helper;
  }, [entry]);

  const { chartData } = chartHelper;

  const CustomBar = React.useMemo(() => {
    return barHighlightSelected(chartData, eventSelected);
  }, [chartData, eventSelected]);
  const CustomTooltip = React.useMemo(
    () => customTooltip(chartHelper),
    [chartHelper]
  );
  const SelectableBar = React.useMemo(
    () =>
      barSelectable(chartData, {
        renderToolTip: (data) => <CustomTooltip data={data} />,
        onDataClick: (data) => setEventSelected?.(data.eventName),
      }),
    [chartData, CustomTooltip, setEventSelected]
  );
  const tickValues = React.useMemo(
    () => chartHelper.getYTicks(10),
    [chartHelper]
  );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Event Participation`}</p>
        </div>
      </CardHeader>
      <CardBody className="overflow-hidden">
        <Skeleton
          classNames={{
            base: 'rounded-lg h-full',
            content: 'h-full',
          }}
          isLoaded={!isLoading}
        >
          <BarChart
            className="min-h-[400px]"
            data={chartData}
            keys={chartHelper.chartKeys}
            indexBy="eventName"
            margin={{
              bottom: 100,
            }}
            axisBottom={{
              legend: 'Event',
              tickRotation: -15,
              legendOffset: 55,
            }}
            gridYValues={tickValues}
            axisLeft={{
              legend: 'Member Count',
              tickValues,
            }}
            enableTotals
            legendPos="bottom"
            legendProp={{
              translateY: 90,
            }}
            // This is being hidden by the bars rendered by CustomBar
            // onDataClick={(data) => setEventSelected(data.eventName)}
            layers={[
              'grid',
              'axes',
              // 'bars',
              CustomBar,
              SelectableBar,
              'totals',
              'markers',
              'legends',
            ]}
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
