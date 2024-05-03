'use client';
import { useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { MainMenu } from '~/view/main-menu';

const CurrentUserInfoQuery = graphql(/* GraphQL */ `
  query currentUserInfo {
    userCurrent {
      id
      email
      communityList {
        id
        name
      }
    }
  }
`);

export default function CommunitySelect() {
  const { data: session } = useSession();
  const result = useQuery(CurrentUserInfoQuery);
  useGraphqlErrorHandler(result);

  if (!session) {
    return null;
  }

  const communityList = result.data?.userCurrent.communityList ?? [];
  const items = communityList.map((entry) => ({
    ...entry,
    href: `/community/${entry.id}/property-list`,
  }));

  return (
    <MainMenu header="Select Database" loading={result.loading} items={items} />
  );
}
