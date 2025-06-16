'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { ByEvent } from './by-event';
import { EventParticipation } from './event-participation';
import { MembershipFee } from './membership-fee';
import { MembershipSource } from './membership-source';
import { YearlyProvider } from './yearly-context';

const DashboardYearlyChartQuery = graphql(/* GraphQL */ `
  query dashboardYearlyChart($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
      }
      ...Dashboard_MembershipSource
      ...Dashboard_EventMembership
      ...Dashboard_EventParticipation
      ...Dashboard_EventTicket
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
    <YearlyProvider>
      <MembershipSource
        fragment={community}
        year={year}
        isLoading={result.loading}
      />
      <MembershipFee
        fragment={community}
        year={year}
        isLoading={result.loading}
      />
      <EventParticipation
        fragment={community}
        year={year}
        isLoading={result.loading}
      />
      <ByEvent fragment={community} year={year} isLoading={result.loading} />
    </YearlyProvider>
  );
};
