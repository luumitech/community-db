import { useQuery } from '@apollo/client';
import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { BarChart } from '~/view/base/chart';

const MemberCountStatQuery = graphql(/* GraphQL */ `
  query memberCountStat($id: String!) {
    communityFromId(id: $id) {
      id
      communityStat {
        memberCountStat {
          year
          renew
          new
        }
      }
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
  onDataClick?: (datum: GQL.MemberCountStat) => void;
}

export const MemberCountChart: React.FC<Props> = ({
  className,
  communityId,
  onDataClick,
}) => {
  const result = useQuery(MemberCountStatQuery, {
    variables: { id: communityId },
  });
  useGraphqlErrorHandler(result);

  const chartData = React.useMemo(() => {
    if (!result.data) {
      return [];
    }
    const { memberCountStat } = result.data.communityFromId.communityStat;
    return memberCountStat;
  }, [result.data]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">Total Membership Counts</p>
          <p className="text-small text-default-500">
            Click on a year, to view details for each year
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg" isLoaded={!result.loading}>
          <BarChart
            className="h-[400px]"
            data={chartData}
            onDataClick={onDataClick}
            keys={['renew', 'new']}
            indexBy="year"
            axisBottom={{
              legend: 'Year',
              // Only show even number year on x-axis
              format: (v) => (v % 2 ? '' : v),
            }}
            axisLeft={{
              legend: 'Member Count',
            }}
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
