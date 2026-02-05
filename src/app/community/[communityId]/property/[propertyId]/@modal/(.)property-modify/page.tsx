'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { evictPropertyListCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { ModifyModal } from './modify-modal';
import { InputData } from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      property {
        ...PropertyId_PropertyEditor
      }
    }
  }
`);

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function PropertyModify(props: RouteArgs) {
  const { communityId } = React.use(props.params);
  const [updateProperty] = useMutation(PropertyMutation);

  const onSave = React.useCallback(
    async (_input: InputData) => {
      const { lat, lon, ...input } = _input;
      await toast.promise(
        updateProperty({
          variables: {
            input: {
              lat: lat?.toString() ?? null,
              lon: lon?.toString() ?? null,
              ...input,
            },
          },
          update: (cache) => {
            /**
             * Updating property address will likely change order within the
             * property list
             */
            evictPropertyListCache(cache, communityId);
          },
        }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
    },
    [updateProperty, communityId]
  );

  return <ModifyModal onSave={onSave} />;
}
