'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import { InputData } from './use-hook-form';

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityModify($input: CommunityModifyInput!) {
    communityModify(input: $input) {
      id
      ...CommunityId_CommunityModifyModal
    }
  }
`);

export default function CommunityModify() {
  const [updateCommunity] = useMutation(CommunityMutation);

  const onSave = React.useCallback(
    async (_input: InputData) => {
      // hidden is not saved in server
      const { hidden, ...input } = _input;
      await toast.promise(
        updateCommunity({
          variables: { input },
          update: (cache, result) => {
            const communityId = result.data?.communityModify.id;
            if (communityId) {
              evictCache(cache, 'CommunityStat', communityId);
            }
          },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [updateCommunity]
  );

  return <ModifyModal onSave={onSave} />;
}
