import { useQuery } from '@apollo/client';
import { Card, CardHeader } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { graphql } from '~/graphql/generated';
import { useYearlyContext } from '../../yearly-context';
import { type MemberSourceStat } from '../_type';
import { MemberCount } from './member-count';
import { NoMember } from './no-member';

const DashboardPrevYearMemberSourceStatQuery = graphql(/* GraphQL */ `
  query dashboardPrevYearMemberSourceStat($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
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
  }
`);

interface Props {
  className?: string;
  year: number;
  memberSourceStat: MemberSourceStat;
}

export const ParticipationChart: React.FC<Props> = ({
  className,
  year,
  memberSourceStat,
}) => {
  const { communityId, eventSelected } = useYearlyContext();
  /**
   * This query can fail if there is no statistics available for the previous
   * year. In that case, let the query fail and handle it gracefully.
   */
  const result = useQuery(DashboardPrevYearMemberSourceStatQuery, {
    variables: {
      id: communityId,
      year: year - 1,
    },
  });
  const prevYearStat = (
    result.data?.communityFromId.communityStat.memberSourceStat ?? []
  ).filter(({ eventName }) => eventName === eventSelected);

  /** Check if there are any member count data in the statistics */
  const noMember = React.useMemo(() => {
    const sum = R.sumBy(
      [...memberSourceStat, ...prevYearStat],
      (entry) => entry.existing + entry.new + entry.renew
    );
    return sum === 0;
  }, [memberSourceStat, prevYearStat]);

  return (
    <Card shadow="sm">
      <CardHeader className="font-semibold">Member Count</CardHeader>
      {noMember ? (
        <NoMember />
      ) : (
        <MemberCount
          year={year}
          yearStat={memberSourceStat}
          prevYearStat={prevYearStat}
        />
      )}
    </Card>
  );
};
