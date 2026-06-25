'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { AccessEditor } from '../common/access-editor';
import { MoreMenu } from '../common/more-menu';
import { AddUserButton } from './add-user-button';

const CommunityAccessModifyQuery = graphql(/* GraphQL */ `
  query CommunityAccessModify($id: String!) {
    communityFromId(id: $id) {
      id
      access {
        id
        user {
          id
          email
        }
      }
      otherAccessList {
        id
        user {
          id
          email
        }
      }
    }
  }
`);

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function AccessModify(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;
  const { isAdmin } = useSelector((state) => state.community);
  const result = useQuery(CommunityAccessModifyQuery, {
    variables: { id: communityId },
    onError,
  });
  const { data, loading } = result;
  const community = React.useMemo(() => data?.communityFromId, [data]);

  /** Generate email list for all users (including self) */
  const accessEmailList = React.useMemo(() => {
    if (!community) {
      return [];
    }
    const { otherAccessList, access } = community;
    return [access, ...otherAccessList].map((entry) => entry.user.email);
  }, [community]);

  return (
    <div className="flex max-h-main-height flex-col">
      <MoreMenu omitKeys={['communityAccessModify']} />
      <AccessEditor communityId={communityId} />
      {isAdmin && (
        <AddUserButton
          className="mt-3"
          communityId={communityId}
          accessEmailList={accessEmailList}
          isDisabled={loading}
        />
      )}
    </div>
  );
}
