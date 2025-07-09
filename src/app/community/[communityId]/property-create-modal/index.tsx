import { useMutation } from '@apollo/client';
import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { CreateModal, type ModalArg } from './create-modal';
import { SuccessDialog } from './success-dialog';
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
      city
      country
      lat
      lon
    }
  }
`);

interface Props {
  modalControl: ModalControl;
}

export const PropertyCreateModal: React.FC<Props> = ({ modalControl }) => {
  const [createProperty] = useMutation(PropertyMutation);
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { lat, lon, ...input } = _input;
      await toast.promise(
        createProperty({
          variables: {
            input: {
              lat: lat?.toString() ?? null,
              lon: lon?.toString() ?? null,
              ...input,
            },
          },
          update: (cache, result) => {
            // Adding property will disrupt the existing property list because the new entry
            // could be anywhere in the list, so wipe the cache, so property list can be
            // retrieved again
            evictCache(cache, 'Community', input.communityId);
          },
        }),
        {
          pending: 'Creating...',
          success: {
            render: ({ data, toastProps }) => (
              <SuccessDialog
                communityId={input.communityId}
                property={data.data?.propertyCreate}
                closeToast={toastProps.closeToast}
              />
            ),
          },
        }
      );
    },
    [createProperty]
  );

  if (arg == null) {
    return null;
  }

  return <CreateModal {...arg} disclosure={disclosure} onSave={onSave} />;
};
