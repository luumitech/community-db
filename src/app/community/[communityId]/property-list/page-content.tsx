import { useQuery } from '@apollo/client';
import {
  Button,
  Link,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import * as R from 'remeda';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { appLabel, appPath } from '~/lib/app-path';
import { PropertyFilterBar } from './property-filter-bar';
import { useTableData } from './use-table-data';

const CommunityFromIdQuery = graphql(/* GraphQL */ `
  query communityFromId(
    $id: String!
    $first: Int! = 10
    $after: String
    $filter: PropertyFilterInput
  ) {
    communityFromId(id: $id) {
      id
      ...CommunityId_CommunityModifyModal
      ...CommunityId_CommunityDeleteModal
      ...CommunityId_PropertyCreateModal
      ...CommunityId_BatchPropertyModifyModal
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

interface Props {}

export const PageContent: React.FC<Props> = (props) => {
  const { communityId, filterArg } = useFilterBarContext();
  const router = useRouter();
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
          filter: filterArg,
        },
      });
    },
  });

  const { columns, renderCell } = useTableData(
    filterArg.memberYear,
    filterArg.nonMemberYear
  );

  const community = React.useMemo(() => data?.communityFromId, [data]);
  const rows = React.useMemo(() => {
    return (community?.propertyList.edges ?? []).map((edge) => edge.node);
  }, [community]);

  const emptyContent = React.useMemo(() => {
    return (
      <div>
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
      </div>
    );
  }, [filterArg, communityId]);

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
      topContent={<PropertyFilterBar community={community} />}
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
                      path: {
                        communityId,
                        propertyId: entry.id,
                      },
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
};
