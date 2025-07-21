'use client';
import { ApolloError, useQuery } from '@apollo/client';
import { Button, Link } from '@heroui/react';
import React from 'react';
import { actions, useDispatch } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { onError } from '~/graphql/on-error';
import { appLabel, appPath } from '~/lib/app-path';
import { toast } from '~/view/base/toastify';

export type CommunityEntry = GQL.CommunityLayoutQuery['communityFromId'];

const CommunityLayoutQuery = graphql(/* GraphQL */ `
  query communityLayout($communityId: String!) {
    communityFromId(id: $communityId) {
      id
      name
      minYear
      maxYear
      eventList {
        name
        hidden
      }
      ticketList {
        name
        unitPrice
        count
        hidden
      }
      paymentMethodList {
        name
        hidden
      }
      defaultSetting {
        membershipFee
      }
      access {
        role
      }
      geoapifySetting {
        apiKey
      }
      ...CommunityId_CommunityModifyModal
      ...CommunityId_BatchPropertyModifyModal
      ...CommunityId_PropertyCreateModal
    }
  }
`);

function customOnError(err: ApolloError) {
  const extensions = err.graphQLErrors?.[0]?.extensions;
  // prisma error code are defined in
  // See: https://www.prisma.io/docs/orm/reference/error-reference
  switch (extensions?.errCode) {
    case 'P2025':
      // This means community is not found
      toast.error(({ closeToast }) => (
        <div className="flex items-center gap-2">
          <div>Community Not Found</div>
          <Button
            className="flex-shrink-0"
            size="sm"
            as={Link}
            color="primary"
            href={appPath('communitySelect')}
            onPress={() => closeToast()}
          >
            {appLabel('communitySelect')}
          </Button>
        </div>
      ));
      return;
  }

  // Let default error handler handle the error
  return err;
}

/**
 * The parent community query for all routes under community/[communityId]
 *
 * The `layout.tsx` will guarantee that all children routes will receive a valid
 * community object before proceeding
 */
export function useCommunityQuery(communityId: string) {
  const dispatch = useDispatch();
  const result = useQuery(CommunityLayoutQuery, {
    variables: { communityId },
    onCompleted: (data) => {
      // Reset ui state whenever community switches to a different one
      dispatch(actions.ui.reset());
    },
    onError: (error) => onError(error, { customOnError }),
  });

  const community = result.data?.communityFromId;
  React.useEffect(() => {
    if (community) {
      // Update header state whenever community changes
      dispatch(actions.community.setCommunity(community));
    }
  }, [dispatch, community]);

  return community;
}
