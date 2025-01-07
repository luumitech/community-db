import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { DeleteModal } from './delete-modal';
import { type UseHookFormWithDisclosureResult } from './use-hook-form';

export {
  useHookFormWithDisclosure,
  type DeleteFragmentType,
} from './use-hook-form';

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityDelete($id: String!) {
    communityDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const CommunityDeleteModal: React.FC<Props> = ({ hookForm }) => {
  const router = useRouter();
  const [deleteCommunity] = useMutation(CommunityMutation);
  const { community } = hookForm;

  const onDelete = React.useCallback(async () => {
    await toast.promise(
      deleteCommunity({
        variables: { id: community.id },
        onCompleted: () => {
          router.push(appPath('communitySelect'));
        },
        update: (cache) => {
          const normalizedId = cache.identify({
            id: community.id,
            __typename: 'Community',
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
  }, [deleteCommunity, community, router]);

  return <DeleteModal hookForm={hookForm} onDelete={onDelete} />;
};
