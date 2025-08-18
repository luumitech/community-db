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

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyDelete($id: String!) {
    propertyDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const PropertyDeleteModal: React.FC<Props> = ({ modalControl }) => {
  const [deleteProperty] = useMutation(PropertyMutation);
  const { arg, disclosure } = modalControl;

  const onDelete = React.useCallback(
    async (
      communityId: string,
      property: GQL.PropertyId_PropertyDeleteFragment
    ) => {
      const { id: propertyId, address } = property;
      await toast.promise(
        // Cache handling will be handled by subscription
        deleteProperty({ variables: { id: propertyId } }),
        {
          pending: `Deleting '${address}'...`,
          success: `Deleted '${address}'`,
        }
      );
    },
    [deleteProperty]
  );

  if (arg == null) {
    return null;
  }

  return <DeleteModal {...arg} disclosure={disclosure} onDelete={onDelete} />;
};
