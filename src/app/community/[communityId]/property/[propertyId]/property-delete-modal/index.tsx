import { useMutation } from '@apollo/client';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { useRouter } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { PropertyEntry } from '../_type';
import { DeleteModal } from './delete-modal';

export const DeleteFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDelete on Property {
    id
    address
  }
`);

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyDelete($id: String!) {
    propertyDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  disclosure: UseDisclosureReturn;
  communityId: string;
  fragment: PropertyEntry;
}

export const PropertyDeleteModal: React.FC<Props> = ({
  disclosure,
  communityId,
  fragment,
}) => {
  const router = useRouter();
  const [deleteProperty] = useMutation(PropertyMutation);

  const onDelete = React.useCallback(async () => {
    await toast.promise(
      deleteProperty({
        variables: { id: fragment.id },
        onCompleted: () => {
          router.push(appPath('propertyList', { communityId }));
        },
        update: (cache) => {
          const normalizedId = cache.identify({
            id: fragment.id,
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
  }, [deleteProperty, fragment, router]);

  return (
    <DeleteModal
      fragment={fragment}
      disclosure={disclosure}
      onDelete={onDelete}
    />
  );
};
