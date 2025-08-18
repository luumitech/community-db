import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { DeleteModal, type ModalArg } from './delete-modal';

export { type ModalArg } from './delete-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
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
  const [deleteCommunity] = useMutation(CommunityMutation);
  const { arg, disclosure } = modalControl;

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

  if (arg == null) {
    return null;
  }

  return <DeleteModal {...arg} disclosure={disclosure} onDelete={onDelete} />;
};
