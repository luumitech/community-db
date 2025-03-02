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
  const router = useRouter();
  const [deleteProperty] = useMutation(PropertyMutation);
  const { modalArg, disclosure } = modalControl;

  const onDelete = React.useCallback(
    async (communityId: string, propertyId: string) => {
      await toast.promise(
        deleteProperty({
          variables: { id: propertyId },
          onCompleted: () => {
            router.push(appPath('propertyList', { path: { communityId } }));
          },
          update: (cache) => {
            const normalizedId = cache.identify({
              id: propertyId,
              __typename: 'Property',
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
    [deleteProperty, router]
  );

  if (modalArg == null) {
    return null;
  }

  return (
    <DeleteModal {...modalArg} disclosure={disclosure} onDelete={onDelete} />
  );
};
