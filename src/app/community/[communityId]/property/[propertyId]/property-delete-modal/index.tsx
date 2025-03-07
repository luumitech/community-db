import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
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
  const router = useRouter();
  const [deleteProperty] = useMutation(PropertyMutation);
  const { arg, disclosure } = modalControl;

  const onDelete = React.useCallback(
    async (communityId: string, propertyId: string) => {
      await toast.promise(
        deleteProperty({
          variables: { id: propertyId },
          update: (cache) => {
            router.push(appPath('propertyList', { path: { communityId } }));
            /**
             * Add timeout to make sure route is changed before updating the
             * cache
             */
            setTimeout(() => {
              evictCache(cache, 'Property', propertyId);
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

  if (arg == null) {
    return null;
  }

  return <DeleteModal {...arg} disclosure={disclosure} onDelete={onDelete} />;
};
