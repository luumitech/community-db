'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
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
    href: appPath('propertyList', { communityId: entry.community.id }),
    children: entry.community.name,
  }));

  return (
    <div>
      <ListBox
        header="Select Community"
        loading={result.loading}
        items={items}
      />
    </div>
  );
}
