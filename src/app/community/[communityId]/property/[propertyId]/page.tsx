'use client';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@nextui-org/react';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { PageContent } from './page-content';
import { PageProvider } from './page-context';

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
      ...CommunityId_CommunityModifyModal
      propertyFromId(id: $propertyId) {
        id
        updatedAt
        updatedBy {
          ...User
        }
        ...PropertyId_PropertyEditor
        ...PropertyId_MembershipDisplay
        ...PropertyId_MembershipEditor
        ...PropertyId_OccupantDisplay
        ...PropertyId_OccupantEditor
        ...PropertyId_PropertyDisplay
        ...PropertyId_PropertyDelete
      }
    }
  }
`);

export default function Property({ params }: RouteArgs) {
  const { communityId, propertyId } = params;
  const result = useQuery(PropertyFromIdQuery, {
    variables: { communityId, propertyId },
  });
  useGraphqlErrorHandler(result);
  const community = result.data?.communityFromId;
  const property = community?.propertyFromId;

  if (!community || !property) {
    return <Skeleton className="h-main-height" />;
  }
  return (
    <PageProvider community={community} property={property}>
      <PageContent />
    </PageProvider>
  );
}
