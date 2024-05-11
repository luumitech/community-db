'use client';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { PropertyEditor } from './property-editor';

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Params;
}

const PropertyFromIdQuery = graphql(/* GraphQL */ `
  query propertyFromId($communityId: ID!, $propertyId: ID!) {
    communityFromId(id: $communityId) {
      id
      propertyFromId(id: $propertyId) {
        ...PropertyId_Editor
      }
    }
  }
`);

export default function Property({ params }: RouteArgs) {
  const result = useQuery(PropertyFromIdQuery, {
    variables: {
      communityId: params.communityId,
      propertyId: params.propertyId,
    },
  });
  useGraphqlErrorHandler(result);
  const property = result.data?.communityFromId.propertyFromId;

  if (!property) {
    return null;
  }

  return (
    <div>
      <PropertyEditor entry={property} />
    </div>
  );
}
