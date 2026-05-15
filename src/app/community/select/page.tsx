'use client';
import { useQuery } from '@apollo/client';
import { Link } from '@heroui/react';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { appLabel, appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { ListBoxInCard, ListBoxItemProps } from '~/view/base/list-box-in-card';
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
    onError,
  });

  const items: ListBoxItemProps[] = React.useMemo(() => {
    const accessList = result.data?.userCurrent.accessList ?? [];
    return accessList.map((entry) => ({
      key: entry.community.id,
      href: appPath('propertyList', {
        path: { communityId: entry.community.id },
      }),
      children: entry.community.name,
    }));
  }, [result.data?.userCurrent.accessList]);

  const emptyContent = React.useMemo(() => {
    return (
      <div className="flex flex-col items-center gap-4">
        No Items.
        <Button as={Link} color="primary" href={appPath('communityCreate')}>
          {appLabel('communityCreate')}
        </Button>
      </div>
    );
  }, []);

  return (
    <div className="mt-page-top">
      <MoreMenu omitKeys={['communitySelect']} />
      <div className="flex flex-row items-center justify-center">
        <ListBoxInCard
          className="w-80 md:w-96"
          header="Select Community"
          loading={result.loading}
          items={items}
          emptyContent={emptyContent}
        />
      </div>
    </div>
  );
}
