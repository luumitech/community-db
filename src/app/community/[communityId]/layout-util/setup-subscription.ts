import { useSubscription } from '@apollo/client';
import { usePathname, useRouter } from 'next/navigation';
import { useUserInfo } from '~/custom-hooks/user-info';
import { evictCache } from '~/graphql/apollo-client/cache-util/evict';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { appPath } from '~/lib/app-path';
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
  const pathname = usePathname();
  const router = useRouter();
  const contextUser = useUserInfo();

  // Subscribe to changes within community
  useSubscription(CommunitySubscription, {
    variables: { id: communityId },
    onData: ({ client, data }) => {
      const { cache } = client;
      const communityFromId = data.data?.communityFromId;
      if (communityFromId) {
        const { community, broadcaster, messageType } = communityFromId;
        if (!community) {
          return;
        }

        // Handle community deletion
        if (messageType === GQL.MessageType.Deleted) {
          /**
           * Need to change path first, otherwise, the current route will try to
           * reload community information but the cache would already have been
           * evicted
           */
          if (pathname.startsWith(`/community/${communityId}`)) {
            router.push(appPath('communitySelect'));
          }
          setTimeout(() => {
            evictCache(cache, 'Community', community.id);
          }, 1000);
        }

        if (broadcaster.email !== contextUser.email) {
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
        if (!property) {
          return;
        }

        // Handle property deletion
        if (messageType === GQL.MessageType.Deleted) {
          /**
           * Need to change path before evicting cache, otherwise, the current
           * route might reference a property that is no longer available
           */
          const propertyPath = `/community/${communityId}/property/${property.id}`;
          if (pathname.startsWith(propertyPath)) {
            router.push(appPath('propertyList', { path: { communityId } }));
          }
          setTimeout(() => {
            evictCache(cache, 'Property', property.id);
          }, 1000);
        }

        if (broadcaster.email !== contextUser.email) {
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
