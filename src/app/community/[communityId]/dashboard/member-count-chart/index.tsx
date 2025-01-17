import { useQuery } from '@apollo/client';
import { Card, CardBody, CardHeader, Skeleton } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { MemberCountBarChart } from './member-count-bar-chart';
import { YearRangeSelect } from './year-range-select';

const MemberCountStatQuery = graphql(/* GraphQL */ `
  query memberCountStat($id: String!) {
    communityFromId(id: $id) {
      id
      maxYear
      ...Dashboard_MemberCount
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
  selectedYear?: number;
  onYearSelect?: (year: number) => void;
}

export const MemberCountChart: React.FC<Props> = ({
  className,
  communityId,
  selectedYear,
  onYearSelect,
}) => {
  const [yearRange, setYearRange] = React.useState<number>(10);
  const result = useQuery(MemberCountStatQuery, {
    variables: { id: communityId },
  });
  useGraphqlErrorHandler(result);
  const community = result.data?.communityFromId;

  React.useEffect(() => {
    if (community) {
      // Whenever new statistics are loaded, show yearly chart for the maxYear
      onYearSelect?.(community.maxYear);
    }
  }, [community, onYearSelect]);

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex w-full justify-between">
          <div>
            <p className="font-bold text-md">Total Membership Counts</p>
            <p className="text-small text-default-500">
              Click on a year, to view details for each year
            </p>
          </div>
          <YearRangeSelect
            defaultSelectedKeys={[yearRange.toString()]}
            onSelectionChange={(keys) => {
              const [firstKey] = keys;
              setYearRange(parseInt(firstKey as string, 10));
            }}
          />
        </div>
      </CardHeader>
      <CardBody className="overflow-hidden">
        <Skeleton className="rounded-lg" isLoaded={!result.loading}>
          <MemberCountBarChart
            fragment={community}
            yearRange={yearRange}
            selectedYear={selectedYear}
            onYearSelect={onYearSelect}
          />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
