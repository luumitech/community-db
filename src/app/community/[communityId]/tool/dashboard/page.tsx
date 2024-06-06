'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { EventParticipation } from './event-participation';
import { MemberCountChart } from './member-count-chart';
import { MembershipSource } from './membership-source';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

const DashboardQuery = graphql(/* GraphQL */ `
  query communityFromIdDashboard($id: ID!) {
    communityFromId(id: $id) {
      id
      communityStat {
        maxYear
        ...Dashboard_MemberCount
        ...Dashboard_EventParticipation
        ...Dashboard_MembershipSource
      }
    }
  }
`);

export default function Dashboard({ params }: RouteArgs) {
  const { communityId } = params;
  const [selectedYear, setSelectedYear] = React.useState<number>();
  const result = useQuery(DashboardQuery, {
    variables: {
      id: communityId,
    },
  });
  useGraphqlErrorHandler(result);

  React.useEffect(() => {
    if (!selectedYear) {
      const maxYear = result.data?.communityFromId.communityStat.maxYear;
      if (maxYear) {
        setSelectedYear(maxYear);
      }
    }
  }, [selectedYear, result]);

  const communityStat = result.data?.communityFromId.communityStat;
  if (!communityStat) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      <MemberCountChart
        entry={communityStat}
        onDataClick={(datum) => setSelectedYear(datum.year)}
      />
      {selectedYear && (
        <div className="columns-2">
          <MembershipSource entry={communityStat} year={selectedYear} />
          <EventParticipation entry={communityStat} year={selectedYear} />
        </div>
      )}
    </div>
  );
}
