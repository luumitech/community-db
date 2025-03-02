import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { DeleteModal, type ModalArg } from './delete-modal';

export { type ModalArg } from './delete-modal';
export const useModalControl = useModalArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityDelete($id: String!) {
    communityDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const CommunityDeleteModal: React.FC<Props> = ({ modalControl }) => {
  const router = useRouter();
  const [deleteCommunity] = useMutation(CommunityMutation);
  const { modalArg, disclosure } = modalControl;

  const onDelete = React.useCallback(
    async (communityId: string) => {
      await toast.promise(
        deleteCommunity({
          variables: { id: communityId },
          onCompleted: () => {
            router.push(appPath('communitySelect'));
          },
          update: (cache) => {
            const normalizedId = cache.identify({
              id: communityId,
              __typename: 'Community',
            });
            /**
             * Add timeout to make sure route is changed before updating the
             * cache
             */
            setTimeout(() => {
              cache.evict({ id: normalizedId });
              cache.gc();
            }, 1000);
          },
        }),
        {
          pending: 'Deleting...',
          success: 'Deleted',
        }
      );
    },
    [deleteCommunity, router]
  );

  if (modalArg == null) {
    return null;
  }

  return (
    <DeleteModal {...modalArg} disclosure={disclosure} onDelete={onDelete} />
  );
};
