import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { EmailGenerator } from './email-generator';

const NonMemberPropertyListQuery = graphql(/* GraphQL */ `
  query nonMemberPropertyList($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
        nonMemberPropertyList(year: $year) {
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

export const NonMember: React.FC<Props> = ({
  className,
  communityId,
  year,
}) => {
  const [emailListQuery] = useLazyQuery(NonMemberPropertyListQuery);

  const listGenerator = React.useCallback(async () => {
    const result = await emailListQuery({
      variables: { id: communityId, year },
    });
    if (result.error) {
      throw result.error;
    }
    return (
      result.data?.communityFromId.communityStat.nonMemberPropertyList ?? []
    );
  }, [emailListQuery, communityId, year]);

  return (
    <EmailGenerator
      className={className}
      listGenerator={listGenerator}
      description={`for households who have not joined membership in ${year}`}
    />
  );
};
