import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import React from 'react';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import { FlatButton } from '~/view/base/flat-button';
import { toast } from '~/view/base/toastify';
import { type AccessEntry } from '../_type';

export const DeleteFragment = graphql(/* GraphQL */ `
  fragment AccessList_Delete on Access {
    id
    user {
      email
    }
  }
`);

export type DeleteFragmentType = FragmentType<typeof DeleteFragment>;

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
  const access = useFragment(DeleteFragment, fragment);
  const [deleteAccess] = useMutation(AccessDeleteMutation);

  const onDelete = React.useCallback(async () => {
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
  }, [deleteAccess, access]);

  return (
    <FlatButton
      className={clsx(className, 'text-danger')}
      icon="trash"
      tooltip="Remove Access"
      onClick={onDelete}
      confirmation
      confirmationArg={{
        bodyText: fragment.isSelf ? (
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
