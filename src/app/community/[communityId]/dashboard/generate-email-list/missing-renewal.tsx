import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { EmailGenerator } from './email-generator';

const NoRenewalPropertyListQuery = graphql(/* GraphQL */ `
  query noRenewalPropertyList($id: String!, $year: Int!) {
    communityFromId(id: $id) {
      id
      communityStat {
        id
        noRenewalPropertyList(year: $year) {
          id
          occupantList {
            email
            optOut
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

export const MissingRenewal: React.FC<Props> = ({
  className,
  communityId,
  year,
}) => {
  const [emailListQuery] = useLazyQuery(NoRenewalPropertyListQuery);

  const listGenerator = React.useCallback(async () => {
    const result = await emailListQuery({
      variables: { id: communityId, year },
    });
    if (result.error) {
      throw result.error;
    }
    return (
      result.data?.communityFromId.communityStat.noRenewalPropertyList ?? []
    );
  }, [emailListQuery, communityId, year]);

  return (
    <EmailGenerator
      className={className}
      listGenerator={listGenerator}
      description={`for households who have not renewed their membership in ${year}`}
    />
  );
};
