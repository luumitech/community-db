import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import { CommunityFromIdDocument } from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';
import { CreateModal, type ModalArg } from './create-modal';
import { type InputData } from './use-hook-form';

export { type ModalArg } from './create-modal';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

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
  modalControl: ModalControl;
}

export const PropertyCreateModal: React.FC<Props> = ({ modalControl }) => {
  const router = useRouter();
  const [createProperty] = useMutation(PropertyMutation);
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (input: InputData) => {
      await toast.promise(
        createProperty({
          variables: { input },
          refetchQueries: [
            // Adding property require refetching property list to get the new
            // property
            {
              query: CommunityFromIdDocument,
              variables: { id: input.communityId },
            },
          ],
          onCompleted: (result) => {
            router.push(
              appPath('property', {
                path: {
                  communityId: input.communityId,
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
    [createProperty, router]
  );

  if (arg == null) {
    return null;
  }

  return <CreateModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
