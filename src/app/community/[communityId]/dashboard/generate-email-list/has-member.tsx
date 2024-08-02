import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { EmailGenerator } from './email-generator';

const MemberPropertyListQuery = graphql(/* GraphQL */ `
  query memberPropertyList($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
        memberPropertyList(year: $year) {
          id
          occupantList {
            email
          }
        }
      }
    }
  }
`);

interface Props {
  className?: string;
  communityId: string;
  year: number;
}

export const HasMember: React.FC<Props> = ({
  className,
  communityId,
  year,
}) => {
  const [emailListQuery] = useLazyQuery(MemberPropertyListQuery);

  const listGenerator = React.useCallback(async () => {
    const result = await emailListQuery({
      variables: { id: communityId, year },
    });
    if (result.error) {
      throw result.error;
    }
    return result.data?.communityFromId.communityStat.memberPropertyList ?? [];
  }, [emailListQuery, communityId, year]);

  return (
    <EmailGenerator
      className={className}
      listGenerator={listGenerator}
      description={`for households who have joined membership in ${year}`}
    />
  );
};
