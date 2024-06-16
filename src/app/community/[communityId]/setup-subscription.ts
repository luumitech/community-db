import { useSubscription } from '@apollo/client';
import { useParams } from 'next/navigation';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';

const CommunitySubscription = graphql(/* GraphQL */ `
  subscription communitySubscription($id: ID!) {
    communityFromId(id: $id) {
      broadcaster {
        email
      }
      mutationType
      community {
        id
        name
      }
    }
  }
`);

const PropertySubscription = graphql(/* GraphQL */ `
  subscription propertySubscription($communityId: ID!) {
    propertyInCommunity(communityId: $communityId) {
      broadcaster {
        email
      }
      mutationType
      property {
        id
        address
      }
    }
  }
`);

function mutationVerb(mutationType: GQL.MutationType) {
  switch (mutationType) {
    case GQL.MutationType.Created:
      return 'created';
    case GQL.MutationType.Updated:
      return 'modified';
    case GQL.MutationType.Deleted:
      return 'deleted';
  }
}

export function useSetupSubscription() {
  const params = useParams<{ communityId?: string }>();
  const communityId = params.communityId;

  // Subscribe to changes within community
  useSubscription(CommunitySubscription, {
    variables: { id: communityId! },
    skip: communityId == null,
    onData: ({ client, data }) => {
      const { cache } = client;
      const communityFromId = data.data?.communityFromId;
      if (communityFromId) {
        const community = communityFromId.community;
        if (community) {
          const { broadcaster, mutationType } = communityFromId;
          evictCache(cache, 'Community', communityId);
          toast.info(
            `${community.name} was ${mutationVerb(mutationType)} by ${
              broadcaster.email
            }`
          );
        }
      }
    },
  });

  useSubscription(PropertySubscription, {
    variables: { communityId: communityId! },
    skip: communityId == null,
    onData: ({ client, data }) => {
      const { cache } = client;
      const propertyInCommunity = data.data?.propertyInCommunity;
      if (propertyInCommunity) {
        const property = propertyInCommunity.property;
        if (property) {
          evictCache(cache, 'Property', property.id);
          // evict community cache too because some fields like
          // community stat are changed if property changes as well
          evictCache(cache, 'Community', communityId);

          const { broadcaster, mutationType } = propertyInCommunity;
          toast.info(
            `${property.address} was ${mutationVerb(mutationType)} by ${
              broadcaster.email
            }`
          );
        }
      }
    },
  });
}
