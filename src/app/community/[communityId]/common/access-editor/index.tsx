'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { AccessTable, type AccessTableProps } from './access-table';

export { RoleSelect } from './role-select';

const CommunityAccessEditorQuery = graphql(/* GraphQL */ `
  query communityAccessEditor($id: String!) {
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
      ...CommunityOwner_Modify
    }
  }
`);

type CustomAccessTableProps = Omit<AccessTableProps, 'items' | 'community'>;

interface Props extends CustomAccessTableProps {
  className?: string;
  communityId: string;
}

export const AccessEditor: React.FC<Props> = ({
  className,
  communityId,
  ...props
}) => {
  const result = useQuery(CommunityAccessEditorQuery, {
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

  return (
    <AccessTable
      className={className}
      community={community}
      items={accessList}
      isLoading={loading}
      {...props}
    />
  );
};
