import { useSubscription } from '@apollo/client';
import { useUserInfo } from '~/custom-hooks/user-info';
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
        lat
        lon
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
  const contextUser = useUserInfo();

  // Subscribe to changes within community
  useSubscription(CommunitySubscription, {
    variables: { id: communityId },
    onData: ({ client, data }) => {
      const { cache } = client;
      const communityFromId = data.data?.communityFromId;
      if (communityFromId) {
        const { community, broadcaster, messageType } = communityFromId;
        if (broadcaster.email === contextUser.email) {
          // Modified by context user, cache should already been handled
          return;
        }
        if (community) {
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
        const { property, broadcaster, messageType } = propertyInCommunity;
        if (broadcaster.email === contextUser.email) {
          // Modified by context user, cache should already been handled
          return;
        }
        if (property) {
          evictCache(cache, 'Property', property.id);
          // community may changed if things like minYear/maxYear changes
          evictCache(cache, 'Community', communityId);
          // community stat may changed if property content changes
          evictCache(cache, 'CommunityStat', communityId);

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
