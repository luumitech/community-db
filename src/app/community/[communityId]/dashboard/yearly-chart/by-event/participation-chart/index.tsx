import { useQuery } from '@apollo/client';
import React from 'react';
import * as R from 'remeda';
import { graphql } from '~/graphql/generated';
import { Card } from '~/view/base/card';
import { usePageContext } from '../../../page-context';
import { type ByEventStat } from '../_type';
import { MemberCountChart } from './member-count-chart';
import { NoMember } from './no-member';

const DashboardPrevYearByEventStatQuery = graphql(/* GraphQL */ `
  query dashboardPrevYearByEventStat($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
        byEventStat(year: $year) {
          eventName
          new
          renew
          existing
          nonMember
        }
      }
    }
  }
`);

interface Props {
  className?: string;
  year: number;
  byEventStat: ByEventStat | null;
}

export const ParticipationChart: React.FC<Props> = ({
  className,
  year,
  byEventStat,
}) => {
  const { communityId, eventSelected } = usePageContext();
  /**
   * This query can fail if there is no statistics available for the previous
   * year. In that case, let the query fail and handle it gracefully.
   */
  const result = useQuery(DashboardPrevYearByEventStatQuery, {
    variables: {
      id: communityId,
      year: year - 1,
    },
  });
  const prevYearStat = (
    result.data?.communityFromId.communityStat.byEventStat ?? []
  ).find(({ eventName }) => eventName === eventSelected);

  /** Check if there are any member count data in the statistics */
  const noMember = React.useMemo(() => {
    const sum = R.sumBy([byEventStat, prevYearStat], (entry) =>
      entry != null
        ? entry.existing + entry.new + entry.renew + entry.nonMember
        : 0
    );
    return sum === 0;
  }, [byEventStat, prevYearStat]);

  return (
    <Card shadow="sm">
      <Card.Header className="font-semibold">Member Count</Card.Header>
      {noMember ? (
        <NoMember />
      ) : (
        <MemberCountChart
          year={year}
          yearStat={byEventStat}
          prevYearStat={prevYearStat ?? null}
        />
      )}
    </Card>
  );
};
