'use client';
import { useMutation } from '@apollo/client';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { Form } from '~/view/base/form';
import { Input } from '~/view/base/input';
import { toast } from '~/view/base/toastify';
import {
  CommunityCreateMutation,
  InputData,
  useHookFormContext,
} from './use-hook-form';

interface Props {}

export const PageContent: React.FC<Props> = (props) => {
  const router = useRouter();
  const [create, result] = useMutation(CommunityCreateMutation);
  const { handleSubmit, formState } = useHookFormContext();

  const createCommunity = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        async () => {
          const newCommunity = await create({ variables: { input } });
          const newId = newCommunity.data?.communityCreate.id;
          if (newId) {
            router.push(
              appPath('propertyList', { path: { communityId: newId } })
            );
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
    <Form onSubmit={handleSubmit(createCommunity)}>
      <Input
        controlName="name"
        autoFocus
        label="Community name"
        placeholder="eg. Wellness Ratepayer Association"
        isRequired
        description="The name can still be changed after the community has been created."
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
    </Form>
  );
};
