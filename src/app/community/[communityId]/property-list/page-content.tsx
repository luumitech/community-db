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
import { PropertyCard } from './property-card';
import { PropertySearchHeader } from './property-search-header';

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
  const rows = React.useMemo(() => {
    return (community?.propertyList.edges ?? []).map((edge) => edge.node);
  }, [community]);

  const EmptyContent = React.useCallback(() => {
    if (result.loading) {
      return <Loading className="mb-4 flex justify-center" />;
    }
    if (!!result.error) {
      return <div className="mb-2">An error has occured.</div>;
    }
    return (
      <div className="flex flex-col items-center">
        <p className="mb-2">No data to display.</p>
        {R.isEmpty(filterArg) && (
          <Button
            as={Link}
            color="primary"
            href={appPath('communityImport', { path: { communityId } })}
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
  }, [dispatch, filterArg, communityId, result]);

  return (
    <>
      {community && <MoreMenu community={community} />}
      <PropertyCard.Container aria-label="Property Table">
        <div
          className={cn(
            'sticky top-header-height z-50 bg-background',
            'col-span-full grid grid-cols-subgrid'
          )}
        >
          <PropertySearchHeader
            className={cn('col-span-full mb-2')}
            community={community}
          />
          <PropertyCard.Header className="mx-0.5" />
        </div>
        {rows.length > 0 &&
          rows.map((property) => (
            <PropertyCard.Entry
              key={property.id}
              className="mx-0.5 hover:bg-primary-50"
              property={property}
              isPressable
              onPress={() => {
                const path = appPath('property', {
                  path: { communityId, propertyId: property.id },
                });
                router.push(path);
              }}
            />
          ))}
        {rows.length === 0 && (
          <div className="col-span-full">
            <EmptyContent />
          </div>
        )}
        {!!pageInfo?.hasNextPage && (
          <Loading
            className="col-span-full mb-4 flex justify-center"
            ref={loadingRef}
          />
        )}
      </PropertyCard.Container>
    </>
  );
};
