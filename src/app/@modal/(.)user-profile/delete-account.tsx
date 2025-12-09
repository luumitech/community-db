import { useQuery } from '@apollo/client';
import { Link } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useDeleteAccount } from '~/custom-hooks/auth';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { appPath } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';

const UserDeletePrerequisiteListQuery = graphql(/* GraphQL */ `
  query userDeletePrerequisiteList {
    userDeletePrerequisiteList {
      id
      name
    }
  }
`);

interface Props {
  className?: string;
}

export const DeleteAccount: React.FC<Props> = ({ className }) => {
  const deleteAccount = useDeleteAccount();
  const result = useQuery(UserDeletePrerequisiteListQuery, {
    fetchPolicy: 'cache-and-network',
    onError,
  });

  const communityList = React.useMemo(() => {
    return result.data?.userDeletePrerequisiteList ?? [];
  }, [result.data]);

  const canDelete = communityList.length === 0;

  const PreRequsite = React.useCallback(() => {
    if (canDelete) {
      return null;
    }

    return (
      <div className="py-3">
        <p>You are the sole administrator for the following communities:</p>
        <ul className="list-disc pb-3 pl-6">
          {communityList.map(({ id, name }) => {
            return (
              <li key={id}>
                <Link
                  className="text-sm"
                  href={appPath('communityShare', {
                    path: { communityId: id },
                  })}
                >
                  {name}
                </Link>
              </li>
            );
          })}
        </ul>
        <p>
          Since you are not the owner of these communities, their data will not
          be removed when you delete your account. But you must assign the
          administrator role to someone else before deleting your account.
        </p>
      </div>
    );
  }, [canDelete, communityList]);

  return (
    <fieldset
      className={twMerge(
        'flex flex-col gap-2',
        'border-t-2 border-danger',
        className
      )}
    >
      <legend className="m-auto px-4 text-sm text-danger">
        Danger Section
      </legend>
      <PreRequsite />
      <Button
        className="shrink-0 self-start"
        color="danger"
        endContent={<Icon icon="trash" />}
        isLoading={result.loading}
        isDisabled={!canDelete}
        confirmation
        confirmationArg={{
          body: (
            <>
              <p className="font-semibold text-danger">
                This will permanently delete your account and all of its data.
                You will not be able to reactivate this account.
              </p>
              <p>Proceed?</p>
            </>
          ),
        }}
        onPress={deleteAccount}
      >
        Delete Account
      </Button>
      <p className="text-sm text-default-400">
        This will permanently delete your account and all of its data. You will
        not be able to reactivate this account.
      </p>
    </fieldset>
  );
};
