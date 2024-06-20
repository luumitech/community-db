import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import React from 'react';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { FlatButton } from '~/view/base/flat-button';
import { toast } from '~/view/base/toastify';

const AccessDeleteMutation = graphql(/* GraphQL */ `
  mutation accessDelete($id: String!) {
    accessDelete(id: $id) {
      id
    }
  }
`);

interface Props {
  className?: string;
  access: GQL.AccessList_ActionFragment;
  isSelf?: boolean;
}

export const RemoveAccess: React.FC<Props> = ({
  className,
  access,
  isSelf,
}) => {
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
        bodyText: isSelf ? (
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
