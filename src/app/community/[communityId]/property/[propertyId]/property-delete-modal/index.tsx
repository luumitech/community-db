import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { DeleteModal } from './delete-modal';
import { type UseHookFormWithDisclosureResult } from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyDelete($id: String!) {
    propertyDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  communityId: string;
  hookForm: UseHookFormWithDisclosureResult;
}

export const PropertyDeleteModal: React.FC<Props> = ({
  communityId,
  hookForm,
}) => {
  const router = useRouter();
  const [deleteProperty] = useMutation(PropertyMutation);
  const { property, disclosure } = hookForm;

  const onDelete = React.useCallback(async () => {
    await toast.promise(
      deleteProperty({
        variables: { id: property.id },
        onCompleted: () => {
          router.push(appPath('propertyList', { communityId }));
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
  }, [deleteProperty, property, communityId, router]);

  return <DeleteModal hookForm={hookForm} onDelete={onDelete} />;
};
