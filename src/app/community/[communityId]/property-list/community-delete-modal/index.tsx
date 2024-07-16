import { useMutation } from '@apollo/client';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { useRouter } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { CommunityEntry } from '../_type';
import { DeleteModal } from './delete-modal';

export const DeleteFragment = graphql(/* GraphQL */ `
  fragment CommunityId_CommunityDeleteModal on Community {
    id
    name
  }
`);

const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityDelete($id: String!) {
    communityDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  disclosure: UseDisclosureReturn;
  fragment: CommunityEntry;
}

export const CommunityDeleteModal: React.FC<Props> = ({
  disclosure,
  fragment,
}) => {
  const router = useRouter();
  const [deleteCommunity] = useMutation(CommunityMutation);

  const onDelete = React.useCallback(async () => {
    await toast.promise(
      deleteCommunity({
        variables: { id: fragment.id },
        onCompleted: () => {
          router.push(appPath('communitySelect'));
        },
        update: (cache) => {
          const normalizedId = cache.identify({
            id: fragment.id,
            __typename: 'Community',
          });
          cache.evict({ id: normalizedId });
          cache.gc();
        },
      }),
      {
        pending: 'Deleting...',
        success: 'Deleted',
      }
    );
  }, [deleteCommunity, fragment, router]);

  return (
    <DeleteModal
      fragment={fragment}
      disclosure={disclosure}
      onDelete={onDelete}
    />
  );
};
