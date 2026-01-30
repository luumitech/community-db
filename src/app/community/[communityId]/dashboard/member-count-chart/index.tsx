import { useQuery } from '@apollo/client';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
  cn,
} from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { lsFlags } from '~/lib/env';
import { FootNote } from './foot-note';
import { MemberCountBarChart } from './member-count-bar-chart';
import { YearRangeSelect } from './year-range-select';
import { YearSelect } from './year-select';

const MemberCountStatQuery = graphql(/* GraphQL */ `
  query memberCountStat($id: String!) {
    communityFromId(id: $id) {
      id
      minYear
      maxYear
      ...Dashboard_MemberCount
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
  selectedYear?: number | null;
  onYearSelect?: (year: number) => void;
}

export const MemberCountChart: React.FC<Props> = ({
  className,
  communityId,
  selectedYear,
  onYearSelect,
}) => {
  const [yearRange = 10, setYearRange] = useLocalStorage(
    lsFlags.dashboardYearRange,
    10
  );
  const result = useQuery(MemberCountStatQuery, {
    variables: { id: communityId },
    onError,
  });
  const community = result.data?.communityFromId;

  return (
    <Card className={cn(className)}>
      <CardHeader
        className={cn('flex flex-col gap-2', 'items-start', 'sm:flex-row')}
      >
        <p className={cn('sm:flex-1', 'text-md font-bold')}>
          Total Membership Counts
        </p>
        <div className="flex gap-2 self-end">
          {community != null && (
            <YearSelect
              minYear={community.minYear}
              maxYear={community.maxYear}
              selectedKeys={
                selectedYear != null ? [selectedYear.toString()] : []
              }
              onSelectionChange={(keys) => {
                const [firstKey] = keys;
                onYearSelect?.(parseInt(firstKey as string, 10));
              }}
            />
          )}
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
        <Skeleton
          classNames={{
            base: 'rounded-lg h-full',
            content: 'h-full',
          }}
          aria-label="skeleton"
          isLoaded={!result.loading}
        >
          <MemberCountBarChart
            fragment={community}
            yearRange={yearRange}
            selectedYear={selectedYear}
            onYearSelect={onYearSelect}
          />
        </Skeleton>
      </CardBody>
      <CardFooter className="justify-center">
        <FootNote />
      </CardFooter>
    </Card>
  );
};
