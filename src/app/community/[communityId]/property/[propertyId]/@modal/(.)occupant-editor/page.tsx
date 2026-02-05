'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { evictPropertyListCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModalDialog } from './modal-dialog';
import { InputData } from './use-hook-form';

const OccupantMutation = graphql(/* GraphQL */ `
  mutation occupantModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      property {
        ...PropertyId_OccupantEditor
      }
    }
  }
`);

interface Params {
  communityId: string;
  propertyId: string;
}

interface SearchParams {
  /** Open tab that matches the email */
  email?: string;
}

interface RouteArgs {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export default function OccupantEditor(props: RouteArgs) {
  const { email } = React.use(props.searchParams);
  const { communityId } = React.use(props.params);
  const [updateOccupant] = useMutation(OccupantMutation);

  const onSave = async (input: InputData) => {
    await toast.promise(
      updateOccupant({
        variables: { input },
        update: (cache) => {
          evictPropertyListCache(cache, communityId);
        },
      }),
      {
        pending: 'Saving...',
        // success: 'Saved',
      }
    );
  };

  return <ModalDialog onSave={onSave} defaultEmail={email} />;
}
