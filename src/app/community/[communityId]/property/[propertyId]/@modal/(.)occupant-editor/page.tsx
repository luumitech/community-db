'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
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
  const { debouncedSearchText } = useSelector((state) => state.searchBar);

  const onSave = async (input: InputData) => {
    await toast.promise(
      updateOccupant({
        variables: { input },
        update: (cache) => {
          /**
           * If search text has been provided, it is possible that an contact
           * name changes would invalidate the results of the property list
           */
          if (!!debouncedSearchText) {
            evictPropertyListCache(cache, communityId);
          }
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
