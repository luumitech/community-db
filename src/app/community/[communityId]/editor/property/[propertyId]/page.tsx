'use client';
import { useQuery } from '@apollo/client';
import { Divider } from '@nextui-org/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { LastModified } from '~/view/last-modified';
import { ContextProvider } from './context';
import { MembershipDisplay } from './membership-display';
import { MembershipEditor } from './membership-editor';
import { OccupantDisplay } from './occupant-display';
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
      eventList {
        name
        hidden
      }
      propertyFromId(id: $propertyId) {
        id
        updatedAt
        updatedBy {
          ...User
        }
        ...PropertyId_PropertyDisplay
        ...PropertyId_MembershipEditor
        ...PropertyId_MembershipDisplay
        ...PropertyId_OccupantDisplay
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
  const community = result.data?.communityFromId;
  if (!community) {
    return null;
  }

  const property = community.propertyFromId;
  const { eventList } = community;

  return (
    <div>
      <ContextProvider eventList={eventList}>
        <PropertyDisplay entry={property} />
        <Divider className="mb-4" />
        <MembershipDisplay entry={property} />
        <MembershipEditor className="mt-2" entry={property} />
        <OccupantDisplay className="my-4" entry={property} />
        <LastModified
          className="text-right"
          updatedAt={property.updatedAt}
          user={property.updatedBy}
        />
      </ContextProvider>
    </div>
  );
}
