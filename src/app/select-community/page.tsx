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
      role
      communityList {
        id
        name
      }
    }
  }
`);

interface Props {}

const SelectCommunity: React.FC<Props> = () => {
  const { data: session } = useSession();
  const result = useQuery(CurrentUserInfoQuery);
  useGraphqlErrorHandler(result);

  if (!session) {
    return null;
  }

  const communityList = result.data?.userCurrent.communityList ?? [];

  return (
    <MainMenu
      header="Select Database"
      loading={result.loading}
      items={communityList}
    />
  );
};

export default SelectCommunity;
