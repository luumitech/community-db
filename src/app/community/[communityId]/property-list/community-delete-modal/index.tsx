import { useMutation } from '@apollo/client';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { DeleteModal } from './delete-modal';

const EntryFragment = graphql(/* GraphQL */ `
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
  community: FragmentType<typeof EntryFragment>;
}

export const CommunityDeleteModal: React.FC<Props> = (props) => {
  const router = useRouter();
  const entry = useFragment(EntryFragment, props.community);
  const [deleteCommunity] = useMutation(CommunityMutation);

  const onDelete = React.useCallback(async () => {
    await toast.promise(
      deleteCommunity({
        variables: { id: entry.id },
        onCompleted: () => {
          router.push(appPath('communitySelect'));
        },
        // update: (cache) => {
        //   const normalizedId = cache.identify({
        //     id: entry.id,
        //     __typename: 'Community',
        //   });
        //   cache.evict({ id: normalizedId });
        //   cache.gc();
        // },
      }),
      {
        pending: 'Deleting...',
        success: 'Deleted',
      }
    );
  }, [deleteCommunity, entry, router]);

  return (
    <DeleteModal
      community={entry}
      disclosure={props.disclosure}
      onDelete={onDelete}
    />
  );
};
