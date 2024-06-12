'use client';
import { useSubscription } from '@apollo/client';
import { useParams } from 'next/navigation';
import React from 'react';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';

const CommunitySubscription = graphql(/* GraphQL */ `
  subscription communitySubscription($id: ID!) {
    communityFromId(id: $id) {
      mutationType
      community {
        id
      }
    }
  }
`);

const PropertySubscription = graphql(/* GraphQL */ `
  subscription propertySubscription($communityId: ID!) {
    propertyInCommunity(communityId: $communityId) {
      mutationType
      property {
        id
      }
    }
  }
`);

interface LayoutProps {
  children: React.ReactNode;
}

export default function CommunityFromIdLayout({ children }: LayoutProps) {
  const params = useParams<{ communityId?: string }>();
  const communityId = params.communityId;

  // Subscribe to changes within community
  useSubscription(CommunitySubscription, {
    variables: { id: communityId! },
    skip: communityId == null,
    onData: ({ client, data }) => {
      const { cache } = client;
      evictCache(cache, 'Community', communityId);
    },
  });

  useSubscription(PropertySubscription, {
    variables: { communityId: communityId! },
    skip: communityId == null,
    onData: ({ client, data }) => {
      const { cache } = client;
      const propertyId = data.data?.propertyInCommunity?.property?.id;
      evictCache(cache, 'Property', propertyId);
      // evict community cache too because some fields like
      // community stat are changes if property changes as well
      evictCache(cache, 'Community', communityId);
    },
  });

  return children;
}
