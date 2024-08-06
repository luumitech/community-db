'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { EventParticipation } from './event-participation';
import { MembershipSource } from './membership-source';

const DashboardYearlyChartQuery = graphql(/* GraphQL */ `
  query dashboardYearlyChart($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
      }
      ...Dashboard_EventParticipation
      ...Dashboard_MembershipSource
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
  year: number;
}

export const YearlyChart: React.FC<Props> = ({
  className,
  communityId,
  year,
}) => {
  const result = useQuery(DashboardYearlyChartQuery, {
    variables: {
      id: communityId,
      year,
    },
  });
  useGraphqlErrorHandler(result);

  const community = result.data?.communityFromId;

  return (
    <>
      <MembershipSource
        fragment={community}
        year={year}
        isLoading={result.loading}
      />
      <EventParticipation
        fragment={community}
        year={year}
        isLoading={result.loading}
      />
    </>
  );
};
