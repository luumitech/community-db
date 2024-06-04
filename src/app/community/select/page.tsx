'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { ListBox, ListboxItemProps } from '~/view/base/list-box';

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
  const items: ListboxItemProps[] = accessList.map((entry) => ({
    key: entry.community.id,
    href: `/community/${entry.community.id}/editor/property-list`,
    children: entry.community.name,
  }));

  return (
    <div>
      <ListBox
        header="Select Database"
        loading={result.loading}
        items={items}
      />
    </div>
  );
}
