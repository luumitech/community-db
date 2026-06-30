import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { getFragment, graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { FlatButton } from '~/view/base/flat-button';
import { toast } from '~/view/base/toastify';
import type { AccessEntry } from '../../_type';

export const DeleteFragment = graphql(/* GraphQL */ `
  fragment AccessList_Delete on Access {
    id
    user {
      email
    }
  }
`);

const AccessDeleteMutation = graphql(/* GraphQL */ `
  mutation accessDelete($id: String!) {
    accessDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  className?: string;
  fragment: AccessEntry;
}

export const RemoveAccess: React.FC<Props> = ({ className, fragment }) => {
  const router = useRouter();
  const access = getFragment(DeleteFragment, fragment);
  const [deleteAccess] = useMutation(AccessDeleteMutation);

  const onDelete = React.useCallback(async () => {
    if (fragment.isSelf) {
      /**
       * If removing own access, navigate away from curent community first,
       * otherwise the mutation is cause error rendering current screen
       */
      router.push(appPath('communitySelect'));
    }
    await toast.promise(
      deleteAccess({
        variables: { id: access.id },
        update: (cache) => {
          const normalizedId = cache.identify({
            id: access.id,
            __typename: access.__typename,
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
  }, [fragment.isSelf, deleteAccess, access, router]);

  return (
    <FlatButton
      className={twMerge('text-danger', className)}
      icon="trash"
      tooltip="Remove Access"
      tooltipProps={{ isFixed: true }}
      onClick={onDelete}
      disabled={fragment.isOwner}
      confirmation
      confirmationArg={{
        body: fragment.isSelf ? (
          <p>
            Are you sure you want to remove your own access? Once access is
            removed, you will no longer be able to view this database.
          </p>
        ) : (
          <p>
            Are you sure you want to remove access for{' '}
            <span className="text-primary">{access.user.email}</span>?
          </p>
        ),
      }}
    />
  );
};
