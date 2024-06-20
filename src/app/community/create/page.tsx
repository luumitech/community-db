'use client';
import { useMutation } from '@apollo/client';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import {
  CommunityCreateMutation,
  InputData,
  useHookForm,
} from './use-hook-form';

export default function CommunityCreate() {
  const router = useRouter();
  const [create, result] = useMutation(CommunityCreateMutation);
  const { handleSubmit, formState, register } = useHookForm();
  const { errors } = formState;

  const createCommunity = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        async () => {
          const newCommunity = await create({ variables: { input } });
          const newId = newCommunity.data?.communityCreate.id;
          if (newId) {
            router.push(appPath('propertyList', { communityId: newId }));
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
        isDisabled={!formState.isDirty || result.loading}
      >
        Create
      </Button>
    </form>
  );
}
