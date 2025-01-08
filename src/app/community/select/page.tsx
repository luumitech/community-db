'use client';
import { useQuery } from '@apollo/client';
import { Button, Link } from '@nextui-org/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { appLabel, appPath } from '~/lib/app-path';
import { ListBox, ListboxItemProps } from '~/view/base/list-box';
import { MoreMenu } from '../common/more-menu';

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
  const result = useQuery(CurrentUserInfoQuery, {
    fetchPolicy: 'cache-and-network',
  });
  useGraphqlErrorHandler(result);

  const accessList = result.data?.userCurrent.accessList ?? [];
  const items: ListboxItemProps[] = accessList.map((entry) => ({
    key: entry.community.id,
    href: appPath('propertyList', {
      path: { communityId: entry.community.id },
    }),
    children: entry.community.name,
  }));

  return (
    <div>
      <MoreMenu omitKeys={['communitySelect']} />
      <ListBox
        header="Select Community"
        loading={result.loading}
        items={items}
        emptyContent={
          <div className="flex flex-col items-center gap-4">
            No Items.
            <Button as={Link} color="primary" href={appPath('communityCreate')}>
              {appLabel('communityCreate')}
            </Button>
          </div>
        }
      />
    </div>
  );
}
