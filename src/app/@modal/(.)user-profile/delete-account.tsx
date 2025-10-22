import { useQuery } from '@apollo/client';
import { cn, Link } from '@heroui/react';
import React from 'react';
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
        <p>
          You are not the owner of these communities, but you are their sole
          administrator. You must assign the administrator role to someone else
          before deleting your account.
        </p>
        <ul className="list-disc pl-6">
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
      </div>
    );
  }, [canDelete, communityList]);

  return (
    <fieldset
      className={cn(
        'flex flex-col gap-2',
        'border-t-2 border-danger',
        className
      )}
    >
      <legend className="text-sm text-danger m-auto px-4">
        Danger Section
      </legend>
      <PreRequsite />
      <Button
        className="self-start"
        color="danger"
        endContent={<Icon icon="trash" />}
        isLoading={result.loading}
        isDisabled={!canDelete}
        confirmation
        confirmationArg={{
          body: (
            <p>
              Deleting account will remove all data associated with your
              account.
              <br />
              Proceed?
            </p>
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
