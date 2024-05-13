'use client';
import { useQuery } from '@apollo/client';
import { Divider } from '@nextui-org/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { toLocalDateTime } from '~/lib/date-util';
import { OccupantDisplay } from './occupant-display';
import { OccupantEditor } from './occupant-editor';
import { PropertyDisplay } from './property-display';
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
        id
        updatedAt
        updatedBy
        ...PropertyId_PropertyDisplay
        ...PropertyId_PropertyEditor
        ...PropertyId_OccupantDisplay
        ...PropertyId_OccupantEditor
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
  const updatedAt = toLocalDateTime(property.updatedAt);

  return (
    <div>
      <PropertyDisplay entry={property} />
      <Divider className="mb-4" />
      <PropertyEditor entry={property} />
      <div className="my-2 text-right text-xs">
        Last modified on {updatedAt} by {property.updatedBy ?? 'n/a'}
      </div>
      <OccupantDisplay className="mb-4" entry={property} />
      <OccupantEditor entry={property} />
    </div>
  );
}
