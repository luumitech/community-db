import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import { graphql } from '~/graphql/generated';
import { CommunityFromIdDocument } from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { CreateModal } from './create-modal';
import {
  type InputData,
  type UseHookFormWithDisclosureResult,
} from './use-hook-form';

export {
  useHookFormWithDisclosure,
  type CreateFragmentType,
} from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyCreate($input: PropertyCreateInput!) {
    propertyCreate(input: $input) {
      id
      address
      streetNo
      streetName
      postalCode
    }
  }
`);

interface Props {
  hookForm: UseHookFormWithDisclosureResult;
}

export const PropertyCreateModal: React.FC<Props> = ({ hookForm }) => {
  const router = useRouter();
  const [createProperty] = useMutation(PropertyMutation);
  const { formMethods, community } = hookForm;

  const onSave = React.useCallback(
    async (input: InputData) => {
      if (!formMethods.formState.isDirty) {
        return;
      }

      await toast.promise(
        createProperty({
          variables: { input },
          refetchQueries: [
            // Adding property require refetching property list to get the new
            // property
            { query: CommunityFromIdDocument, variables: { id: community.id } },
          ],
          onCompleted: (result) => {
            router.push(
              appPath('property', {
                path: {
                  communityId: community.id,
                  propertyId: result.propertyCreate.id,
                },
              })
            );
          },
        }),
        {
          pending: 'Creating...',
          success: 'Created',
        }
      );
    },
    [formMethods.formState, createProperty, router, community.id]
  );

  return (
    <FormProvider {...formMethods}>
      <CreateModal hookForm={hookForm} onSave={onSave} />
    </FormProvider>
  );
};
