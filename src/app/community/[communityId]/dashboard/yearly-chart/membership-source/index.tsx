import { Card, CardBody, CardHeader, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { PieChart } from '~/view/base/chart';
import { ChartDataHelperUtil } from '../../chart-data-helper';
import { type DashboardEntry } from '../_type';
import { useYearlyContext } from '../yearly-context';

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
  GQL.Dashboard_MembershipSourceFragment['communityStat']['memberSourceStat'];

interface ChartDataEntry {
  id: string;
  label: string;
  value: number;
}

class ChartDataHelper extends ChartDataHelperUtil<ChartDataEntry> {
  constructor(private stat: MemberSourceStat) {
    super();

    this.stat.forEach((entry) => {
      const value = entry.new + entry.renew;
      // Filter out events with no member sign-up
      if (value) {
        this.chartData.push({
          id: entry.eventName,
          label: entry.eventName,
          value,
        });
      }
    });
  }

  yVal(entry: ChartDataEntry) {
    return entry.value;
  }
}

interface Props {
  className?: string;
  fragment?: DashboardEntry;
  year: number;
  isLoading?: boolean;
}

export const MembershipSource: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
  const { setEventSelected } = useYearlyContext();
  const entry = getFragment(MembershipSourceFragment, fragment);

  const chartHelper = React.useMemo(() => {
    const memberSourceStat = entry?.communityStat.memberSourceStat ?? [];
    const helper = new ChartDataHelper(memberSourceStat);
    return helper;
  }, [entry]);

  const { chartData } = chartHelper;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Membership Source`}</p>
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
          <PieChart
            className="min-h-[400px]"
            data={chartData}
            onClick={(data) => setEventSelected(data.data.label)}
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
