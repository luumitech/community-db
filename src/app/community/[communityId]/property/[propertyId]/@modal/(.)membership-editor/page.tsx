'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import {
  evictCache,
  evictPropertyListCache,
} from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import { toast } from '~/view/base/toastify';
import { ModalDialog } from './modal-dialog';
import { InputData } from './use-hook-form';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation membershipModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      # Modifying membership may change minYear/maxYear
      community {
        id
        minYear
        maxYear
      }
      property {
        ...PropertyId_MembershipEditor
      }
    }
  }
`);

interface SearchParams {
  autoFocus?: 'notes-helper';
}

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}

export default function MembershipEditor(props: RouteArgs) {
  const searchParams = React.use(props.searchParams);
  const { communityId } = React.use(props.params);
  const [updateProperty] = useMutation(PropertyMutation);
  const { isFilterSpecified } = useSelector((state) => state.searchBar);

  const onSave = async (_input: InputData) => {
    const { hidden, ...input } = _input;
    await toast.promise(
      updateProperty({
        variables: { input },
        update: (cache, result) => {
          evictCache(cache, 'CommunityStat', communityId);
          /**
           * If any of the filter (i.e. memberYear) has been specified, then it
           * is possible that the existing property list query would no longer
           * yield the same results after membership editor changes are
           * applied.
           */
          if (isFilterSpecified) {
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

  return <ModalDialog onSave={onSave} autoFocus={searchParams.autoFocus} />;
}
