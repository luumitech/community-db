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
  query communityFromIdDashboard($id: String!) {
    communityFromId(id: $id) {
      id
      communityStat {
        maxYear
      }
      ...Dashboard_MemberCount
      ...Dashboard_EventParticipation
      ...Dashboard_MembershipSource
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

  const community = result.data?.communityFromId;
  if (!community) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <MemberCountChart
        // Top chart always occupy first row
        className="col-span-full"
        fragment={community}
        onDataClick={(datum) => setSelectedYear(datum.year)}
      />
      {selectedYear && (
        <>
          <MembershipSource fragment={community} year={selectedYear} />
          <EventParticipation fragment={community} year={selectedYear} />
        </>
      )}
    </div>
  );
}
