'use client';
import { useQuery } from '@apollo/client';
import {
  Button,
  Input,
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useDebounce } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useAppContext } from '~/custom-hooks/app-context';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { MoreMenu } from './more-menu';
import { useTableData } from './use-table-data';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

const CommunityFromIdQuery = graphql(/* GraphQL */ `
  query communityFromId(
    $id: String!
    $first: Int! = 10
    $after: String
    $search: String
  ) {
    communityFromId(id: $id) {
      id
      ...CommunityId_CommunityModifyModal
      ...CommunityId_CommunityDeleteModal
      propertyList(first: $first, after: $after, search: $search) {
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

export default function PropertyList({ params }: RouteArgs) {
  const { communityId } = useAppContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.ui.propertyListSearch);
  const debouncedSearchText = useDebounce(searchText, 300);
  const result = useQuery(CommunityFromIdQuery, {
    skip: communityId == null,
    variables: {
      id: communityId!,
      first: 10, // load 10 entries initally
      search: debouncedSearchText,
    },
  });
  useGraphqlErrorHandler(result);
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
          search: debouncedSearchText,
        },
      });
    },
  });
  const { columns, renderCell } = useTableData();

  const community = React.useMemo(() => data?.communityFromId, [data]);
  const rows = React.useMemo(() => {
    return (community?.propertyList.edges ?? []).map((edge) => edge.node);
  }, [community]);

  const topContent = React.useMemo(() => {
    const totalCount = community?.propertyList.totalCount ?? 0;
    const setSearchText = (input?: string) => {
      dispatch(actions.ui.setPropertyListSearch(input));
    };
    return (
      <div className="flex gap-2">
        <Input
          isClearable
          placeholder="Search Address or Member Name"
          description={`${totalCount} entries found`}
          startContent={<Icon icon="search" />}
          defaultValue={searchText}
          onValueChange={setSearchText}
          onClear={() => setSearchText(undefined)}
        />
        {community && <MoreMenu fragment={community} />}
      </div>
    );
  }, [community, searchText, dispatch]);

  const emptyContent = React.useMemo(() => {
    return (
      <div>
        <p className="mb-2">No data to display.</p>
        {!!community?.id && !debouncedSearchText && (
          <Button
            as={Link}
            color="primary"
            href={appPath('communityImport', {
              communityId: community.id,
            })}
          >
            Import Community
          </Button>
        )}
      </div>
    );
  }, [debouncedSearchText, community?.id]);

  return (
    <Table
      aria-label="Property Table"
      classNames={{
        base: ['max-h-main-height'],
        // Don't use array here
        // See: https://github.com/nextui-org/nextui/issues/2304
        // replaces the removeWrapper attribute
        // use this to keep scroll bar within table
        wrapper: 'p-0',
      }}
      // removeWrapper
      isHeaderSticky
      selectionMode="single"
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={
        !!pageInfo?.hasNextPage && (
          <Spinner
            className="flex w-full justify-center mb-4"
            ref={loadingRef}
          />
        )
      }
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} className={column.className}>
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        isLoading={loading}
        loadingContent={<Spinner />}
        emptyContent={emptyContent}
        items={rows}
      >
        {(entry) => (
          <TableRow key={entry.id}>
            {(columnKey) => (
              <TableCell
                onClick={() =>
                  router.push(
                    appPath('property', {
                      communityId: params.communityId,
                      propertyId: entry.id,
                    })
                  )
                }
              >
                <div className="h-6">{renderCell(entry, columnKey)}</div>
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
