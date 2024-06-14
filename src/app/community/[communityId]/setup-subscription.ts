import { useSubscription } from '@apollo/client';
import { useParams } from 'next/navigation';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
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
          const { broadcaster } = communityFromId;
          evictCache(cache, 'Community', communityId);
          toast.info(`${community.name} was modified by ${broadcaster.email}`);
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

          const { broadcaster } = propertyInCommunity;
          toast.info(
            `${property.address} was modified by ${broadcaster.email}`
          );
        }
      }
    },
  });
}
