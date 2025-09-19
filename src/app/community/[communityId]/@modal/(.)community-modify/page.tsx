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

interface Params {
  communityId: string;
}

interface SearchParams {
  tab?: string;
}

interface RouteArgs {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export default function CommunityModify(props: RouteArgs) {
  const { communityId } = React.use(props.params);
  const { tab } = React.use(props.searchParams);
  const [updateCommunity] = useMutation(CommunityMutation);

  const onSave = React.useCallback(
    async (_input: InputData) => {
      // hidden is not saved in server
      const { hidden, ...input } = _input;
      await toast.promise(
        updateCommunity({
          variables: { input },
          update: (cache, result) => {
            evictCache(cache, 'CommunityStat', communityId);
          },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [communityId, updateCommunity]
  );

  return <ModifyModal defaultTab={tab} onSave={onSave} />;
}
