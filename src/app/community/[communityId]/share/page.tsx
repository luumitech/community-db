'use client';
import { useQuery } from '@apollo/client';
import { useDisclosure } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { MoreMenu } from '../common/more-menu';
import { AccessTable } from './access-table';
import { AddUserButton } from './add-user-button';
import { CopyShareLink } from './copy-share-link';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

const CommunityAccessListQuery = graphql(/* GraphQL */ `
  query communityAccessList($id: String!) {
    communityFromId(id: $id) {
      id
      name
      owner {
        id
      }
      access {
        id
        role
        user {
          id
        }
        ...AccessList_User
        ...AccessList_Role
        ...AccessList_Modify
        ...AccessList_Delete
      }
      otherAccessList {
        id
        user {
          id
        }
        ...AccessList_User
        ...AccessList_Role
        ...AccessList_Modify
        ...AccessList_Delete
      }
    }
  }
`);

export default function Share(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;
  const { isAdmin } = useSelector((state) => state.community);
  const disclosure = useDisclosure();
  const result = useQuery(CommunityAccessListQuery, {
    variables: { id: communityId },
    onError,
  });
  const { data, loading } = result;
  const community = React.useMemo(() => data?.communityFromId, [data]);

  /** Generate access list for all users (including self) */
  const accessList = React.useMemo(() => {
    if (!community) {
      return [];
    }
    const { otherAccessList, access, owner } = community;
    return [
      // Add isSelf flag for your own access entry
      { isSelf: true, ...access },
      // Other user's access list
      ...otherAccessList,
    ].map((entry) => ({
      ...entry,
      isOwner: entry.user.id === owner?.id,
    }));
  }, [community]);

  const topContent = React.useMemo(() => {
    if (!community) {
      return null;
    }
    return <CopyShareLink className="mb-2" communityId={community.id} />;
  }, [community]);

  return (
    <div className="flex max-h-main-height flex-col">
      <MoreMenu omitKeys={['communityShare']} />
      <AccessTable
        className="grow overflow-auto"
        items={accessList}
        isLoading={loading}
        topContent={topContent}
      />
      {community != null && isAdmin && (
        <AddUserButton
          className="mt-3"
          communityId={community.id}
          accessList={accessList}
        />
      )}
    </div>
  );
}
