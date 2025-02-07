import { useSubscription } from '@apollo/client';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { toast } from '~/view/base/toastify';

const CommunitySubscription = graphql(/* GraphQL */ `
  subscription communitySubscription($id: String!) {
    communityFromId(id: $id) {
      broadcaster {
        email
      }
      messageType
      community {
        id
        name
      }
    }
  }
`);

const PropertySubscription = graphql(/* GraphQL */ `
  subscription propertySubscription($communityId: String!) {
    propertyInCommunity(communityId: $communityId) {
      broadcaster {
        email
      }
      messageType
      property {
        id
        address
      }
    }
  }
`);

function messageVerb(messageType: GQL.MessageType) {
  switch (messageType) {
    case GQL.MessageType.Created:
      return 'created';
    case GQL.MessageType.Updated:
      return 'modified';
    case GQL.MessageType.Deleted:
      return 'deleted';
  }
}

export function useSetupSubscription(communityId: string) {
  // Subscribe to changes within community
  useSubscription(CommunitySubscription, {
    variables: { id: communityId },
    onData: ({ client, data }) => {
      const { cache } = client;
      const communityFromId = data.data?.communityFromId;
      if (communityFromId) {
        const community = communityFromId.community;
        if (community) {
          const { broadcaster, messageType } = communityFromId;
          evictCache(cache, 'Community', communityId);
          toast.info(
            `${community.name} was ${messageVerb(messageType)} by ${
              broadcaster.email
            }`
          );
        }
      }
    },
  });

  useSubscription(PropertySubscription, {
    variables: { communityId },
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

          const { broadcaster, messageType } = propertyInCommunity;
          toast.info(
            `${property.address} was ${messageVerb(messageType)} by ${
              broadcaster.email
            }`
          );
        }
      }
    },
  });
}
