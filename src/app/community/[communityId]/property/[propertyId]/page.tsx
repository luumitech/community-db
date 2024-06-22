'use client';
import { useQuery } from '@apollo/client';
import { Divider } from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { LastModified } from '~/view/last-modified';
import { MembershipDisplay } from './membership-display';
import { MembershipEditor } from './membership-editor';
import { OccupantDisplay } from './occupant-display';
import { OccupantEditor } from './occupant-editor';
import { PropertyDisplay } from './property-display';

interface Params {
  communityId: string;
  propertyId: string;
}

interface RouteArgs {
  params: Params;
}

const PropertyFromIdQuery = graphql(/* GraphQL */ `
  query propertyFromId($communityId: String!, $propertyId: String!) {
    communityFromId(id: $communityId) {
      id
      propertyFromId(id: $propertyId) {
        id
        updatedAt
        updatedBy {
          ...User
        }
        ...PropertyId_MembershipDisplay
        ...PropertyId_MembershipEditor
        ...PropertyId_OccupantDisplay
        ...PropertyId_OccupantEditor
        ...PropertyId_PropertyDisplay
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
  const { canEdit } = useAppContext();
  const community = result.data?.communityFromId;
  if (!community) {
    return null;
  }

  const property = community.propertyFromId;

  return (
    <div className="flex flex-col gap-3">
      <PropertyDisplay fragment={property} />
      <Divider />
      <MembershipDisplay fragment={property} />
      {canEdit && <MembershipEditor fragment={property} />}
      <OccupantDisplay fragment={property} />
      {canEdit && <OccupantEditor fragment={property} />}
      <LastModified
        className="text-right"
        updatedAt={property.updatedAt}
        userFragment={property.updatedBy}
      />
    </div>
  );
}
