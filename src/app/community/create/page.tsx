'use client';
import { useMutation } from '@apollo/client';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { InputData, useHookForm } from './use-hook-form';

const CommunityCreateMutation = graphql(/* GraphQL */ `
  mutation communityCreate($name: String!) {
    communityCreate(name: $name) {
      id
      name
    }
  }
`);

export default function CommunityCreate() {
  const router = useRouter();
  const [create, result] = useMutation(CommunityCreateMutation);
  const { handleSubmit, formState, register } = useHookForm();
  const { errors } = formState;

  const createCommunity = React.useCallback(
    async (form: InputData) => {
      toast.promise(
        async () => {
          const newCommunity = await create({ variables: form });
          const newId = newCommunity.data?.communityCreate.id;
          if (newId) {
            router.push(`/community/${newId}/editor/property-list`);
          }
        },
        {
          pending: 'Creating...',
          success: 'Community created',
        }
      );
    },
    [create, router]
  );

  return (
    <form onSubmit={handleSubmit(createCommunity)}>
      <Input
        autoFocus
        label="Community name"
        placeholder="Enter community name"
        isRequired
        errorMessage={errors.name?.message}
        isInvalid={!!errors.name?.message}
        {...register('name')}
      />
      <Button
        className="mt-2"
        color="primary"
        type="submit"
        isDisabled={!formState.isDirty}
        isLoading={result.loading}
      >
        Create
      </Button>
    </form>
  );
}
