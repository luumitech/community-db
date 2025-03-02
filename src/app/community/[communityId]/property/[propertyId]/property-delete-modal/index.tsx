import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useModalArg } from '~/custom-hooks/modal-arg';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
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
  const { community, property } = usePageContext();
  const { modalArg, disclosure } = modalControl;

  const onDelete = React.useCallback(async () => {
    await toast.promise(
      deleteProperty({
        variables: { id: property.id },
        onCompleted: () => {
          router.push(
            appPath('propertyList', { path: { communityId: community.id } })
          );
        },
        update: (cache) => {
          const normalizedId = cache.identify({
            id: property.id,
            __typename: 'Property',
          });
          /** Add timeout to make sure route is changed before updating the cache */
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
  }, [deleteProperty, property, community, router]);

  if (modalArg == null) {
    return null;
  }

  return (
    <DeleteModal {...modalArg} disclosure={disclosure} onDelete={onDelete} />
  );
};
