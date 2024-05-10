'use client';
import { useQuery } from '@apollo/client';
import {
  Button,
  Input,
  Spacer,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { useDebounce } from '@uidotdev/usehooks';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import * as R from 'remeda';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { Membership } from './membership';
import { Occupant } from './occupant';
import { PropertyAddress } from './property-address';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
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

type PropertyEntry =
  GQL.CommunityFromIdQuery['communityFromId']['propertyList']['edges'][0]['node'];

export default function PropertyList({ params }: RouteArgs) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [limit, setLimit] = React.useState(10);
  const searchText = useSelector((state) => state.ui.propertyListSearch);
  const debouncedSearchText = useDebounce(searchText, 300);
  const result = useQuery(CommunityFromIdQuery, {
    variables: {
      id: params.communityId,
      first: limit,
      search: debouncedSearchText,
    },
  });
  useGraphqlErrorHandler(result);
  const { data, loading, fetchMore } = result;
  const pageInfo = data?.communityFromId.propertyList.pageInfo;
  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore: !!pageInfo?.hasNextPage,
    onLoadMore: () => {
      fetchMore({
        variables: {
          after: pageInfo?.endCursor,
          search: debouncedSearchText,
        },
      });
    },
  });

  const rows = (data?.communityFromId.propertyList.edges ?? []).map(
    (edge) => edge.node
  );

  const columns = [
    { name: 'Address', uid: 'address', className: 'w-1/6' },
    { name: 'Members', uid: 'occupant' },
    { name: curYear, uid: 'curYear', className: 'w-10' },
    { name: prevYear, uid: 'prevYear', className: 'w-10' },
  ];

  const renderCell = React.useCallback(
    (entry: PropertyEntry, columnKey: React.Key) => {
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

  const topContent = React.useMemo(() => {
    const totalCount = data?.communityFromId.propertyList.totalCount ?? 0;
    const setSearchText = (input?: string) => {
      dispatch(actions.ui.setPropertyListSearch(input));
    };
    return (
      <div>
        <Input
          isClearable
          placeholder="Search ..."
          description={`${totalCount} entries found`}
          startContent={<FaSearch className="text-xl2" />}
          defaultValue={searchText}
          onValueChange={setSearchText}
          onClear={() => setSearchText(undefined)}
        />
      </div>
    );
  }, [data, searchText, dispatch]);

  return (
    <Table
      aria-label="Property Table"
      classNames={{
        // 64px is the height of header
        // 0.5rem is the top margin of the main div
        base: [`max-h-[calc(100vh-64px-0.5rem)]`],
        // Don't use array here
        // See: https://github.com/nextui-org/nextui/issues/2304
        // replaces the removeWrapper attribute
        // use this to keep scroll bar within table
        wrapper: 'p-0',
      }}
      baseRef={scrollerRef}
      // removeWrapper
      isHeaderSticky
      selectionMode="single"
      topContent={topContent}
      topContentPlacement="outside"
      bottomContent={
        !!pageInfo?.hasNextPage && (
          <Spinner
            className="flex w-full justify-center mb-4"
            ref={loaderRef}
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
      <TableBody
        isLoading={loading}
        loadingContent={<Spinner />}
        emptyContent={'No data to display.'}
        items={rows}
      >
        {(entry) => (
          <TableRow key={entry.id}>
            {(columnKey) => (
              <TableCell
                onClick={() =>
                  router.push(`${pathname}/../property/${entry.id}`)
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

  //   {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
  // {/* <Button>
  //   <Link href={`${pathname}/../import`}>Import</Link>
  // </Button> */}
}
