'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { MainMenu } from '~/view/main-menu';

const CurrentUserInfoQuery = graphql(/* GraphQL */ `
  query currentUserInfo {
    userCurrent {
      id
      email
      accessList {
        role
        community {
          id
          name
        }
      }
    }
  }
`);

export default function CommunitySelect() {
  const result = useQuery(CurrentUserInfoQuery);
  useGraphqlErrorHandler(result);

  const accessList = result.data?.userCurrent.accessList ?? [];
  const items = accessList.map((entry) => ({
    ...entry.community,
    href: `/community/${entry.community.id}/editor/property-list`,
  }));

  return (
    <div>
      <MainMenu
        header="Select Database"
        loading={result.loading}
        items={items}
      />
    </div>
  );
}
