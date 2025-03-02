import { useMutation } from '@apollo/client';
import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModifyModal, type ModalArg } from './modify-modal';
import { InputData } from './use-hook-form';

export { type ModalArg } from './modify-modal';
export const useModalControl = useModalArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityModify($input: CommunityModifyInput!) {
    communityModify(input: $input) {
      id
      ...CommunityId_CommunityModifyModal
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const CommunityModifyModal: React.FC<Props> = ({ modalControl }) => {
  const [updateCommunity] = useMutation(CommunityMutation);
  const { modalArg, disclosure } = modalControl;

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

  if (modalArg == null) {
    return null;
  }

  return <ModifyModal {...modalArg} disclosure={disclosure} onSave={onSave} />;
};
