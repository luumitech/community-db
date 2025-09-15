'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { CreateModal } from './create-modal';
import { SuccessDialog } from './success-dialog';
import { type InputData } from './use-hook-form';

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

export default function PropertyCreate() {
  const [createProperty] = useMutation(PropertyMutation);

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

  return <CreateModal onSave={onSave} />;
}
