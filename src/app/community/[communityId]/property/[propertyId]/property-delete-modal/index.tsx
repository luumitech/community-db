import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { usePageContext } from '../page-context';
import { DeleteModal } from './delete-modal';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyDelete($id: String!) {
    propertyDelete(id: $id) {
      id
    }
  }
`);

interface Props {}

export const PropertyDeleteModal: React.FC<Props> = (props) => {
  const router = useRouter();
  const [deleteProperty] = useMutation(PropertyMutation);
  const { community, property, propertyDelete } = usePageContext();
  const { modalArg, disclosure } = propertyDelete;

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
    <div>
      <DeleteModal {...modalArg} disclosure={disclosure} onDelete={onDelete} />
    </div>
  );
};
