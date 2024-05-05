'use client';
import { useLazyQuery } from '@apollo/client';
import {
  Button,
  Pagination,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { PropertyAddress } from './property-address';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

/**
 * convert page number (1-based) to array entry offset (0-based)
 * @param page page to display
 * @param limit number of maximum entry per page
 * @returns
 */
function pageToOffset(page: number, limit: number) {
  return (page - 1) * limit;
}

const CommunityFromIdQuery = graphql(/* GraphQL */ `
  query communityFromId($id: ID!, $offset: Int! = 0, $limit: Int! = 10) {
    communityFromId(id: $id) {
      id
      name
      propertyCount
      propertyList(offset: $offset, limit: $limit) {
        ...PropertyList_Address
      }
    }
  }
`);

export default function PropertyList({ params }: RouteArgs) {
  const pathname = usePathname();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [queryList, result] = useLazyQuery(CommunityFromIdQuery);
  useGraphqlErrorHandler(result);
  const { data, loading } = result;

  React.useEffect(() => {
    queryList({
      variables: {
        id: params.communityId,
        offset: pageToOffset(page, limit),
        limit,
      },
    });
  }, [queryList, params.communityId, limit, page]);

  const onPageChange = async (pg: number) => {
    setPage(pg);
  };

  const propertyCount = data?.communityFromId.propertyCount ?? 0;
  const totalPages = Math.ceil(propertyCount / limit);
  const entries = data?.communityFromId.propertyList ?? [];
  /**
   * Determine number of rows to show in table,
   * - while loading, should show `limit` number of rows
   * - after data has been loaded, if there are entries to show, show `limit` number of rows
   * - if data is empty, don't show any rows
   */
  const rowsToShow = loading || totalPages ? limit : 0;

  return (
    <div>
      <Table aria-label="Property Table">
        <TableHeader>
          <TableColumn>Address</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'No data to display.'}>
          {Array.from({ length: rowsToShow }, (_, idx) => {
            const entry = entries[idx];
            return (
              <TableRow key={idx}>
                <TableCell>
                  <PropertyAddress entry={entry} loading={loading} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Spacer y={4} />
      {totalPages > 0 && (
        <Pagination
          className="mx-0"
          total={totalPages}
          page={page}
          onChange={onPageChange}
        />
      )}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <Button>
        <Link href={`${pathname}/import`}>Import</Link>
      </Button> */}
    </div>
  );
}
