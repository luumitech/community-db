'use client';
import { useMutation } from '@apollo/client';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
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
  useGraphqlErrorHandler(result);
  const { handleSubmit, formState, register } = useHookForm();
  const { errors } = formState;

  const createCommunity = async (form: InputData) => {
    const newCommunity = await create({ variables: form });
    const newId = newCommunity.data?.communityCreate.id;
    if (newId) {
      router.push(`/community/${newId}/property-list`);
    }
  };

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
