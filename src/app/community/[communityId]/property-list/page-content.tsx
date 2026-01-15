import { useQuery } from '@apollo/client';
import { Button, Link, cn } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import * as R from 'remeda';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { onError } from '~/graphql/on-error';
import { appLabel, appPath } from '~/lib/app-path';
import { Loading } from '~/view/base/loading';
import { MoreMenu } from './more-menu';
import { PropertySearchHeader } from './property-search-header';
import { PropertyTable, type PropertyTableProps } from './property-table';

type GTProps = Required<PropertyTableProps>;

const CommunityFromIdQuery = graphql(/* GraphQL */ `
  query communityFromId(
    $id: String!
    $first: Int! = 10
    $after: String
    $filter: PropertyFilterInput
  ) {
    communityFromId(id: $id) {
      id
      ...CommunityId_CommunityDeleteModal
      propertyList(first: $first, after: $after, filter: $filter) {
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
        edges {
          node {
            id
            ...PropertyList_Address
            ...PropertyList_Occupant
            ...PropertyList_Membership
          }
        }
      }
    }
  }
`);

interface Props {
  communityId: string;
}

export const PageContent: React.FC<Props> = ({ communityId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { filterArg } = useSelector((state) => state.searchBar);
  const result = useQuery(CommunityFromIdQuery, {
    variables: {
      id: communityId,
      first: 10, // load 10 entries initally
      filter: filterArg,
    },
    context: {
      // Requests get debounced together if they share the same debounceKey.
      // Requests without a debounce key are passed to the next link unchanged.
      debounceKey: 'CommunityFromIdQuery',
    },
    onError,
  });
  const { data, loading, fetchMore } = result;
  const pageInfo = data?.communityFromId.propertyList.pageInfo;
  const [loadingRef] = useInfiniteScroll({
    loading,
    disabled: !!result.error,
    hasNextPage: !!pageInfo?.hasNextPage,
    onLoadMore: () => {
      fetchMore({
        variables: {
          after: pageInfo?.endCursor,
          filter: filterArg,
        },
      });
    },
  });

  const community = React.useMemo(() => data?.communityFromId, [data]);

  const EmptyContent = React.useCallback(() => {
    if (result.loading) {
      return <Loading className="mb-4 flex justify-center" />;
    }
    if (result.error) {
      return <div className="mb-2">An error has occured.</div>;
    }
    return (
      <div className="flex flex-col items-center">
        <p className="mt-6 mb-2 font-semibold text-default-400">
          No data to display.
        </p>
        {R.isEmpty(filterArg) && (
          <Button
            as={Link}
            color="primary"
            href={appPath('communityImport', {
              path: { communityId },
            })}
          >
            {appLabel('communityImport')}
          </Button>
        )}
        {!R.isEmpty(filterArg) && (
          <Button
            color="primary"
            onPress={() => dispatch(actions.searchBar.reset())}
          >
            Clear Filter
          </Button>
        )}
      </div>
    );
  }, [result, filterArg, communityId, dispatch]);

  const BottomContent = React.useCallback(() => {
    if (!pageInfo?.hasNextPage) {
      return null;
    }
    return <Loading className="mb-4 flex justify-center" ref={loadingRef} />;
  }, [pageInfo, loadingRef]);

  const items = React.useMemo(() => {
    return (community?.propertyList.edges ?? []).map((edge) => edge.node);
  }, [community]);

  const itemCardProps: GTProps['itemCardProps'] = React.useCallback(
    (item) => {
      return {
        isPressable: true,
        onPress: () => {
          const path = appPath('property', {
            path: { communityId, propertyId: item.id },
          });
          router.push(path);
        },
      };
    },
    [communityId, router]
  );

  return (
    <>
      {community && <MoreMenu community={community} />}
      <PropertyTable
        items={items}
        itemCardProps={itemCardProps}
        showHeader
        topContent={<PropertySearchHeader community={community} />}
        emptyContent={<EmptyContent />}
        bottomContent={<BottomContent />}
      />
    </>
  );
};
