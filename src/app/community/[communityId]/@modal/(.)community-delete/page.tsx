'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { DeleteModal } from './delete-modal';

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityDelete($id: String!) {
    communityDelete(id: $id) {
      id
    }
  }
`);

export default function CommunityDelete() {
  const [deleteCommunity] = useMutation(CommunityMutation);

  const onDelete = React.useCallback(
    async (community: GQL.CommunityId_CommunityDeleteModalFragment) => {
      await toast.promise(
        // Cache handling will be handled by subscription
        deleteCommunity({ variables: { id: community.id } }),
        {
          pending: `Deleting '${community.name}'...`,
          success: `Deleted '${community.name}'`,
        }
      );
    },
    [deleteCommunity]
  );

  return <DeleteModal onDelete={onDelete} />;
}
