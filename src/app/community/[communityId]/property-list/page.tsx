'use client';
import { useLazyQuery } from '@apollo/client';
import {
  Button,
  Input,
  Pagination,
  Skeleton,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { offsetToCursor } from '@pothos/plugin-relay';
import { useDebounce } from '@uidotdev/usehooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { CiEdit } from 'react-icons/ci';
import { FaSearch } from 'react-icons/fa';
import * as R from 'remeda';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import { Membership } from './membership';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

/**
 * Calculate the cursor position suitable to query entries
 * within the input 'page' using the 'after' cursor argument.
 *
 * @param page page to display
 * @param limit number of maximum entry per page
 * @returns
 */
function pageToCursor(page: number, limit: number) {
  const offset = (page - 1) * limit;
  if (offset === 0) {
    // If requesting the first page, after cursor
    // should be undefined
    return undefined;
  }
  // If querying first page, then we need to return the
  // cursor for the last entry in the previous page
  return offsetToCursor(offset - 1);
}

const curYear = new Date().getFullYear();
const prevYear = curYear - 1;

const CommunityFromIdQuery = graphql(/* GraphQL */ `
  query communityFromId(
    $id: ID!
    $first: Int! = 10
    $after: String
    $search: String
  ) {
    communityFromId(id: $id) {
      id
      name
      propertyList(first: $first, after: $after, search: $search) {
        listInfo {
          totalCount
          pageCount
        }
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
  const pathname = usePathname();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [searchText, setSearchText] = React.useState<string>();
  const debouncedSearchText = useDebounce(searchText, 300);
  const [queryList, result] = useLazyQuery(CommunityFromIdQuery);
  useGraphqlErrorHandler(result);
  const { data, previousData, loading } = result;

  React.useEffect(() => {
    queryList({
      variables: {
        id: params.communityId,
        first: limit,
        after: pageToCursor(page, limit),
        search: debouncedSearchText,
      },
    });
  }, [queryList, params.communityId, limit, page, debouncedSearchText]);

  const totalPages =
    data?.communityFromId.propertyList.listInfo.pageCount ??
    previousData?.communityFromId.propertyList.listInfo.pageCount ??
    0;

  /**
   * Determine number of rows to show in table,
   * - while loading, should show `limit` number of rows
   * - after data has been loaded, if there are entries to show, show `limit` number of rows
   * - if data is empty, don't show any rows
   */
  const rowsToShow = loading || totalPages ? limit : 0;
  const rows = R.times(rowsToShow, (idx) => {
    const edges = data?.communityFromId.propertyList.edges ?? [];
    const entry = edges[idx]?.node;
    return entry ?? { id: `placeholder-${idx}` };
  });

  const columns = [
    { name: 'Address', uid: 'address', className: 'w-1/6' },
    { name: 'Members', uid: 'occupant' },
    { name: curYear, uid: 'curYear', className: 'w-10' },
    { name: prevYear, uid: 'prevYear', className: 'w-10' },
  ];

  const renderCell = React.useCallback(
    (entry: (typeof rows)[0], columnKey: React.Key) => {
      if (entry.id.startsWith('placeholder')) {
        return <div className="h-5" />;
      }
      switch (columnKey) {
        case 'address':
          return <PropertyAddress entry={entry} />;
        case 'occupant':
          return <Occupant entry={entry} />;
        case 'curYear':
          return <Membership entry={entry} year={curYear} />;
        case 'prevYear':
          return <Membership entry={entry} year={prevYear} />;
        default:
          return null;
      }
    },
    []
  );

  return (
    <div>
      <Input
        label="Search"
        isClearable
        startContent={<FaSearch className="text-xl2" />}
        onChange={(evt) => setSearchText(evt.currentTarget.value)}
        onClear={() => setSearchText(undefined)}
      />
      <Spacer y={2} />
      <Table
        aria-label="Property Table"
        removeWrapper
        selectionMode="single"
        bottomContent={
          totalPages > 0 && (
            <Pagination
              className="flex"
              total={totalPages}
              page={page}
              onChange={setPage}
            />
          )
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} className={column.className}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={'No data to display.'} items={rows}>
          {(entry) => (
            <TableRow key={entry.id}>
              {(columnKey) => (
                <TableCell>
                  <Skeleton isLoaded={!loading} className="rounded-lg">
                    <div className="h-6">{renderCell(entry, columnKey)}</div>
                  </Skeleton>
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {/* <Button>
        <Link href={`${pathname}/../import`}>Import</Link>
      </Button> */}
    </div>
  );
}
