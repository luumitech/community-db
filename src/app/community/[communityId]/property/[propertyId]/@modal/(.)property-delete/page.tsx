'use client';
import { useMutation } from '@apollo/client';
import React from 'react';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';
import { DeleteModal } from './delete-modal';

const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyDelete($id: String!) {
    propertyDelete(id: $id) {
      id
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

export default function PropertyDelete(props: RouteArgs) {
  const [deleteProperty] = useMutation(PropertyMutation);

  const onDelete = React.useCallback(
    async (property: GQL.PropertyId_PropertyDeleteFragment) => {
      const { id: propertyId, address } = property;
      await toast.promise(
        // Cache handling will be handled by subscription
        deleteProperty({ variables: { id: propertyId } }),
        {
          pending: `Deleting '${address}'...`,
          success: `Deleted '${address}'`,
        }
      );
    },
    [deleteProperty]
  );

  return <DeleteModal onDelete={onDelete} />;
}
